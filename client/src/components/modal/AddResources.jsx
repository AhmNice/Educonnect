import React, { useState, useRef, useEffect } from "react";

import {
  X,
  Upload,
  FileText,
  Video,
  Link,
  BookOpen,
  Plus,
  Image,
  File,
} from "lucide-react";
import { useCourseStore } from "../../store/courseStore";
import { useResourceStore } from "../../store/resource.Store";
import { useAuthStore } from "../../store/authStore";

const AddResourceModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState("upload");
  const { addResource } = useResourceStore();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    course: "",
    tags: [],
    access: "public",
    file: null,
    videoUrl: "",
    externalUrl: "",
  });
  const [newTag, setNewTag] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const { courses, getAllCourses } = useCourseStore();
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        await getAllCourses();
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [getAllCourses]);

  // URL validation helpers
  const validateVideoUrl = (url) => {
    const platforms = {
      youtube: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/i,
      vimeo: /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/i,
      dailymotion: /^(https?:\/\/)?(www\.)?dailymotion\.com\/.+/i,
    };

    return Object.values(platforms).some((regex) => regex.test(url));
  };

  const validateExternalUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    } else if (formData.title.length > 100) {
      newErrors.title = "Title must be less than 100 characters";
    }

    // course validation
    if (!formData.course) {
      newErrors.course = "course is required";
    }

    // Tab-specific validation
    if (activeTab === "upload" && !formData.file) {
      newErrors.file = "Please select a file";
    }

    if (activeTab === "video" && !formData.videoUrl.trim()) {
      newErrors.videoUrl = "Video URL is required";
    } else if (activeTab === "video" && formData.videoUrl.trim()) {
      if (!validateVideoUrl(formData.videoUrl)) {
        newErrors.videoUrl =
          "Please enter a valid YouTube, Vimeo, or Dailymotion URL";
      }
    }

    if (activeTab === "link" && !formData.externalUrl.trim()) {
      newErrors.externalUrl = "URL is required";
    } else if (activeTab === "link" && formData.externalUrl.trim()) {
      if (!validateExternalUrl(formData.externalUrl)) {
        newErrors.externalUrl = "Please enter a valid URL";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File handling with drag and drop
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0];
    if (file) {
      validateAndSetFile(file);
    }
  };

  const validateAndSetFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/gif",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "application/zip",
    ];
    const maxSize = 50 * 1024 * 1024; // 50MB

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        file: "Please select a valid file type (PDF, DOC, PPT, TXT, Images, ZIP)",
      }));
      return;
    }

    if (file.size > maxSize) {
      setErrors((prev) => ({
        ...prev,
        file: "File size must be less than 50MB",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      file,
      title: prev.title || file.name.replace(/\.[^/.]+$/, ""), // Use filename as title if empty
    }));
    setErrors((prev) => ({ ...prev, file: "" }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange({ target: { files } });
    }
  };

  // File icon based on type
  const getFileIcon = (file) => {
    if (!file) return <Upload className="w-12 h-12 text-gray-400 mx-auto" />;

    const extension = file.name.split(".").pop()?.toLowerCase();
    const fileType = file.type.split("/")[0];

    if (fileType === "image")
      return <Image className="w-12 h-12 text-green-600 mx-auto" />;
    if (file.type === "application/pdf")
      return <FileText className="w-12 h-12 text-red-600 mx-auto" />;
    if (file.type.includes("word") || file.type.includes("document"))
      return <FileText className="w-12 h-12 text-blue-600 mx-auto" />;
    if (file.type.includes("powerpoint") || file.type.includes("presentation"))
      return <FileText className="w-12 h-12 text-orange-600 mx-auto" />;
    if (file.type === "application/zip")
      return <File className="w-12 h-12 text-purple-600 mx-auto" />;

    return <FileText className="w-12 h-12 text-indigo-600 mx-auto" />;
  };

  // Tag management
  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      if (formData.tags.length >= 10) {
        setErrors((prev) => ({ ...prev, tags: "Maximum 10 tags allowed" }));
        return;
      }
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
      setErrors((prev) => ({ ...prev, tags: "" }));
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    setIsUploading(true);
    const payload = new FormData();
    payload.append("uploader_id", user.user_id);
    payload.append("course", formData.course);
    payload.append("description", formData.description);
    payload.append("access", formData.access);
    payload.append("externalUrl", formData.externalUrl);
    payload.append("videoUrl", formData.videoUrl);
    payload.append("title", formData.title);
    if (formData.file) {
      payload.append("file", formData.file);
    }
    payload.append("tags", JSON.stringify(formData.tags));
    try {
      const response = await addResource(payload);
      if (!response.success) {
        return;
      }
      handleClose();
    } catch (error) {
      console.error("Error uploading resource:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Error uploading resource. Please try again.",
      }));
    } finally {
      setIsUploading(false);
    }
  };

  // Form reset
  const handleClose = () => {
    setFormData({
      title: "",
      description: "",
      course: "",
      tags: [],
      access: "public",
      file: null,
      videoUrl: "",
      externalUrl: "",
    });
    setNewTag("");
    setActiveTab("upload");
    setErrors({});
    setIsUploading(false);
    setIsDragging(false);
    onClose();
  };

  // Character counters
  const charCount = {
    title: formData.title.length,
    description: formData.description.length,
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Add New Resource
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Resource Type Tabs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Resource Type
              </label>
              <div
                className="flex space-x-1 bg-gray-100 p-1 rounded-lg"
                role="tablist"
                aria-label="Resource type"
              >
                {[
                  { id: "upload", label: "Upload File", icon: Upload },
                  { id: "video", label: "Video URL", icon: Video },
                  { id: "link", label: "External Link", icon: Link },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors flex-1 ${
                      activeTab === tab.id
                        ? "bg-white text-indigo-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                    aria-selected={activeTab === tab.id}
                    role="tab"
                    aria-controls={`${tab.id}-panel`}
                  >
                    <tab.icon className="w-4 h-4" aria-hidden="true" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* File Upload Section */}
            {activeTab === "upload" && (
              <div role="tabpanel" id="upload-panel">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload File
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? "border-indigo-400 bg-indigo-50"
                      : formData.file
                      ? "border-indigo-300 bg-indigo-50"
                      : "border-gray-300 hover:border-indigo-400"
                  } ${errors.file ? "border-red-300 bg-red-50" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  aria-describedby={errors.file ? "file-error" : undefined}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif,.zip"
                    aria-invalid={!!errors.file}
                  />
                  {formData.file ? (
                    <div className="space-y-2">
                      {getFileIcon(formData.file)}
                      <p className="text-sm font-medium text-gray-900">
                        {formData.file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(formData.file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData((prev) => ({ ...prev, file: null }));
                        }}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {isDragging
                            ? "Drop file here"
                            : "Click to upload or drag and drop"}
                        </p>
                        <p className="text-xs text-gray-500">
                          PDF, DOC, PPT, TXT, Images, ZIP (Max 50MB)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                {errors.file && (
                  <p id="file-error" className="mt-2 text-sm text-red-600">
                    {errors.file}
                  </p>
                )}
              </div>
            )}

            {/* Video URL Section */}
            {activeTab === "video" && (
              <div role="tabpanel" id="video-panel">
                <label
                  htmlFor="videoUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Video URL *
                </label>
                <input
                  type="url"
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      videoUrl: e.target.value,
                    }));
                    if (errors.videoUrl)
                      setErrors((prev) => ({ ...prev, videoUrl: "" }));
                  }}
                  placeholder="https://youtube.com/watch?v=..."
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.videoUrl ? "border-red-300" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.videoUrl}
                  aria-describedby={
                    errors.videoUrl ? "videoUrl-error" : undefined
                  }
                />
                {errors.videoUrl && (
                  <p id="videoUrl-error" className="mt-2 text-sm text-red-600">
                    {errors.videoUrl}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Supported: YouTube, Vimeo, Dailymotion and other video
                  platforms
                </p>
              </div>
            )}

            {/* External Link Section */}
            {activeTab === "link" && (
              <div role="tabpanel" id="link-panel">
                <label
                  htmlFor="externalUrl"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Resource URL *
                </label>
                <input
                  type="url"
                  id="externalUrl"
                  value={formData.externalUrl}
                  onChange={(e) => {
                    setFormData((prev) => ({
                      ...prev,
                      externalUrl: e.target.value,
                    }));
                    if (errors.externalUrl)
                      setErrors((prev) => ({ ...prev, externalUrl: "" }));
                  }}
                  placeholder="https://example.com/resource"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.externalUrl ? "border-red-300" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.externalUrl}
                  aria-describedby={
                    errors.externalUrl ? "externalUrl-error" : undefined
                  }
                />
                {errors.externalUrl && (
                  <p
                    id="externalUrl-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.externalUrl}
                  </p>
                )}
              </div>
            )}

            {/* Common Fields */}
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Title *
                  </label>
                  <span
                    className={`text-xs ${
                      charCount.title > 100 ? "text-red-600" : "text-gray-500"
                    }`}
                  >
                    {charCount.title}/100
                  </span>
                </div>
                <input
                  type="text"
                  id="title"
                  required
                  value={formData.title}
                  onChange={(e) => {
                    setFormData((prev) => ({ ...prev, title: e.target.value }));
                    if (errors.title)
                      setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  placeholder="Enter resource title"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.title ? "border-red-300" : "border-gray-300"
                  }`}
                  aria-invalid={!!errors.title}
                  aria-describedby={errors.title ? "title-error" : undefined}
                  maxLength={100}
                />
                {errors.title && (
                  <p id="title-error" className="mt-2 text-sm text-red-600">
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <span
                    className={`text-xs ${
                      charCount.description > 500
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {charCount.description}/500
                  </span>
                </div>
                <textarea
                  id="description"
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what this resource is about..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                  maxLength={500}
                />
              </div>

              {/* course and Access */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="course"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    course *
                  </label>
                  <select
                    id="course"
                    required
                    value={formData.course}
                    onChange={(e) => {
                      setFormData((prev) => ({
                        ...prev,
                        course: e.target.value,
                      }));
                      if (errors.course)
                        setErrors((prev) => ({ ...prev, course: "" }));
                    }}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white ${
                      errors.course ? "border-red-300" : "border-gray-300"
                    }`}
                    aria-invalid={!!errors.course}
                    aria-describedby={
                      errors.course ? "course-error" : undefined
                    }
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course.course_id} value={course.course_id}>
                        {course.course_title}
                      </option>
                    ))}
                  </select>
                  {errors.course && (
                    <p id="course-error" className="mt-2 text-sm text-red-600">
                      {errors.course}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="access"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Access Level
                  </label>
                  <select
                    id="access"
                    value={formData.access}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        access: e.target.value,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                  >
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                    <option value="class">Class Only</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tags
                  </label>
                  <span className="text-xs text-gray-500">
                    {formData.tags.length}/10
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center space-x-1 px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-indigo-600 focus:outline-none"
                        aria-label={`Remove tag ${tag}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    maxLength={20}
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    disabled={!newTag.trim() || formData.tags.length >= 10}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {errors.tags && (
                  <p className="mt-2 text-sm text-red-600">{errors.tags}</p>
                )}
              </div>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isUploading}
            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isUploading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Add Resource</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddResourceModal;

import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  FileText,
  File,
  Image,
  Video,
  Music,
  BookOpen,
  Calendar,
  User,
  Tag,
  MoreVertical,
  Loader2,
  Copy,
  Link,
  ExternalLink,
  Folder,
  FileArchive,
  FileCode,
  FileSpreadsheet,
  FileVideo,
  FileAudio,
} from "lucide-react";
import PageLayout from "../../layout/PageLayout";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { useResourceStore } from "../../store/resource.Store";

// Resource Form Component
const ResourceForm = ({ resource, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState(
    resource || {
      title: "",
      type: "pdf",
      description: "",
      course: "",
      author: "",
      tags: [],
    }
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);

  const fileTypes = [
    { value: "pdf", label: "PDF Document", icon: FileText },
    { value: "docx", label: "Word Document", icon: File },
    { value: "xlsx", label: "Excel Spreadsheet", icon: FileSpreadsheet },
    { value: "pptx", label: "PowerPoint", icon: File },
    { value: "jpg", label: "Image (JPG)", icon: Image },
    { value: "png", label: "Image (PNG)", icon: Image },
    { value: "mp4", label: "Video (MP4)", icon: Video },
    { value: "mp3", label: "Audio (MP3)", icon: Music },
    { value: "zip", label: "Archive (ZIP)", icon: FileArchive },
    { value: "txt", label: "Text File", icon: FileText },
    { value: "code", label: "Code File", icon: FileCode },
    { value: "other", label: "Other", icon: File },
  ];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.course.trim()) newErrors.course = "Course is required";
    if (!resource && !file)
      newErrors.file = "File is required for new resources";
    return newErrors;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Preview for images
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setFilePreview(null);
      }

      // Auto-detect file type based on extension
      const extension = selectedFile.name.split(".").pop().toLowerCase();
      const fileType =
        fileTypes.find((t) => t.value === extension)?.value || "other";
      setFormData({ ...formData, type: fileType });
    }
  };

  const getFileIcon = (type) => {
    const fileType = fileTypes.find((t) => t.value === type);
    return fileType ? fileType.icon : File;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const formDataToSend = new FormData();

      // Add form data
      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add file if exists
      if (file) {
        formDataToSend.append("file", file);
      }

      if (resource) {
        const { data } = await api.put(
          `/resources/update/${resource.resource_id}`,
          formDataToSend,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (!data.success) {
          throw new Error(data.message || "Failed to update resource");
        }

        toast.success("Resource updated successfully");
      } else {
        const { data } = await api.post("/resources/create", formDataToSend, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (!data.success) {
          throw new Error(data.message || "Failed to create resource");
        }

        toast.success("Resource created successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving resource:", error);
      toast.error(
        error.response?.data?.message || error.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  const FileIcon = getFileIcon(formData.type);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {resource ? "Edit Resource" : "Upload New Resource"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {resource ? "Replace File (Optional)" : "Upload File *"}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-xl hover:border-blue-400 transition-colors">
              <div className="space-y-4 text-center">
                {filePreview ? (
                  <div className="flex flex-col items-center">
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg mb-2"
                    />
                    <p className="text-sm text-gray-600">{file?.name}</p>
                  </div>
                ) : resource ? (
                  <div className="flex flex-col items-center">
                    <FileIcon className="w-16 h-16 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      Current file: {resource.title}.{resource.type}
                    </p>
                  </div>
                ) : (
                  <File className="w-16 h-16 mx-auto text-gray-400" />
                )}

                <div className="flex text-sm text-gray-600">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload a file</span>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="sr-only"
                      accept=".pdf,.docx,.xlsx,.pptx,.jpg,.jpeg,.png,.mp4,.mp3,.zip,.txt"
                      disabled={loading}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOCX, XLSX, PPTX, JPG, PNG, MP4, MP3, ZIP, TXT up to 10MB
                </p>
              </div>
            </div>
            {errors.file && (
              <p className="text-red-500 text-sm mt-1">{errors.file}</p>
            )}
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => {
                  setFormData({ ...formData, title: e.target.value });
                  if (errors.title) setErrors({ ...errors, title: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Resource Title"
                disabled={loading}
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                File Type
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                {fileTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description)
                  setErrors({ ...errors, description: undefined });
              }}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe this resource..."
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => {
                  setFormData({ ...formData, course: e.target.value });
                  if (errors.course)
                    setErrors({ ...errors, course: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.course ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Course Name"
                disabled={loading}
              />
              {errors.course && (
                <p className="text-red-500 text-sm mt-1">{errors.course}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Author
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Author Name"
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag (press Enter)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={loading}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {resource ? "Updating..." : "Uploading..."}
                </>
              ) : resource ? (
                "Update Resource"
              ) : (
                "Upload Resource"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Resource Card Component
const ResourceCard = React.memo(
  ({ resource, onEdit, onDelete, onDownload }) => {
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getFileIcon = (type) => {
      switch (type?.toLowerCase()) {
        case "pdf":
          return { icon: FileText, color: "text-red-500", bg: "bg-red-50" };
        case "docx":
          return { icon: File, color: "text-blue-500", bg: "bg-blue-50" };
        case "xlsx":
          return {
            icon: FileSpreadsheet,
            color: "text-green-500",
            bg: "bg-green-50",
          };
        case "pptx":
          return { icon: File, color: "text-orange-500", bg: "bg-orange-50" };
        case "jpg":
        case "jpeg":
        case "png":
          return { icon: Image, color: "text-purple-500", bg: "bg-purple-50" };
        case "mp4":
          return { icon: Video, color: "text-indigo-500", bg: "bg-indigo-50" };
        case "mp3":
          return { icon: Music, color: "text-pink-500", bg: "bg-pink-50" };
        case "zip":
          return {
            icon: FileArchive,
            color: "text-yellow-500",
            bg: "bg-yellow-50",
          };
        default:
          return { icon: File, color: "text-gray-500", bg: "bg-gray-50" };
      }
    };

    const fileInfo = getFileIcon(resource.type);
    const FileIcon = fileInfo.icon;

    const handleDownload = async () => {
      try {
        const response = await api.get(
          `/resources/download/${resource.resource_id}`,
          {
            responseType: "blob",
          }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${resource.title}.${resource.type}`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        toast.success("Download started");
      } catch (error) {
        console.error("Error downloading resource:", error);
        toast.error("Failed to download resource");
      }
    };

    return (
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`${fileInfo.bg} p-3 rounded-xl`}>
                <FileIcon className={`w-6 h-6 ${fileInfo.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {resource.title}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                  <span className="font-mono text-xs px-2 py-1 bg-gray-100 rounded">
                    .{resource.type}
                  </span>
                  <span>•</span>
                  <span>{formatDate(resource.uploadDate)}</span>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onDownload(resource)}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                aria-label="Download resource"
              >
                <Download className="w-4 h-4" />
              </button>
            
              <button
                onClick={() => onDelete(resource)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                aria-label="Delete resource"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {resource.description}
          </p>

          {/* Course and Author */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
            <div className="flex items-center">
              <BookOpen className="w-4 h-4 mr-1" />
              <span className="truncate">{resource.course}</span>
            </div>
            {resource.author && (
              <div className="flex items-center">
                <User className="w-4 h-4 mr-1" />
                <span>{resource.author}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {resource.tags && resource.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {resource.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Uploader Info */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Uploaded by {resource?.uploader?.full_name || "Unknown"}
            </div>
            <div className="text-xs text-gray-500">
              ID: {resource.resource_id?.slice(-8) || "N/A"}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ResourceCard.displayName = "ResourceCard";

// Resource Table Row Component
const ResourceRow = React.memo(
  ({ resource, selected, onSelect, onEdit, onDelete, onDownload }) => {
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getFileIcon = (type) => {
      switch (type?.toLowerCase()) {
        case "pdf":
          return { icon: FileText, color: "text-red-500", bg: "bg-red-100" };
        case "docx":
          return { icon: File, color: "text-blue-500", bg: "bg-blue-100" };
        case "xlsx":
          return {
            icon: FileSpreadsheet,
            color: "text-green-500",
            bg: "bg-green-100",
          };
        case "pptx":
          return { icon: File, color: "text-orange-500", bg: "bg-orange-100" };
        case "jpg":
        case "jpeg":
        case "png":
          return { icon: Image, color: "text-purple-500", bg: "bg-purple-100" };
        case "mp4":
          return { icon: Video, color: "text-indigo-500", bg: "bg-indigo-100" };
        case "mp3":
          return { icon: Music, color: "text-pink-500", bg: "bg-pink-100" };
        case "zip":
          return {
            icon: FileArchive,
            color: "text-yellow-500",
            bg: "bg-yellow-100",
          };
        default:
          return { icon: File, color: "text-gray-500", bg: "bg-gray-100" };
      }
    };

    const fileInfo = getFileIcon(resource.type);
    const FileIcon = fileInfo.icon;

    return (
      <tr
        className={`border-b border-gray-200 hover:bg-gray-50 ${
          selected ? "bg-blue-50" : ""
        }`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(resource.resource_id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={`Select ${resource.title}`}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className={`${fileInfo.bg} p-2 rounded-lg`}>
              <FileIcon className={`w-5 h-5 ${fileInfo.color}`} />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {resource.title}
              </div>
              <div className="text-sm text-gray-500">
                <span className="font-mono text-xs">.{resource.type}</span>
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {resource.course}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="max-w-xs truncate">{resource.description}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-wrap gap-1 max-w-xs">
            {resource.tags?.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
            {resource.tags?.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(resource.uploadDate)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => onDownload(resource)}
              className="text-blue-600 hover:text-blue-900 transition-colors"
              aria-label="Download resource"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              onClick={() => onDelete(resource)}
              className="text-red-600 hover:text-red-900 transition-colors"
              aria-label="Delete resource"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

ResourceRow.displayName = "ResourceRow";

const ResourcesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedResources, setSelectedResources] = useState([]);
  const [activeView, setActiveView] = useState("list");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState(null);
  const { fetchAllResource, resources } = useResourceStore();
  const [loading, setLoading] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [deletingResource, setDeletingResource] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [stats, setStats] = useState({
    totalResources: 0,
    byType: {},
    totalSize: "0 MB",
    recentUploads: 0,
  });

  const [filters, setFilters] = useState({
    type: "all",
    course: "all",
  });

  const fetchResources = useCallback(async () => {
    setLoading(true);
    try {
      await fetchAllResource();
      // Calculate stats
      const total = resources.length;

      // Count by type
      const byType = {};
      resources.forEach((resource) => {
        const type = resource.type || "other";
        byType[type] = (byType[type] || 0) + 1;
      });

      // Count recent uploads (last 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const recentUploads = resources.filter(
        (resource) => new Date(resource.uploadDate) > sevenDaysAgo
      ).length;

      setStats({
        totalResources: total,
        byType,
        recentUploads,
        totalSize: "0 MB", // This would come from backend if available
      });
    } catch (error) {
      console.error("Error fetching resources:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load resources"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResources();
  }, [fetchResources]);

  const handleDeleteResource = async (resourceId) => {
    if (!resourceId) return;

    try {
      const { data } = await api.delete(`/resources/delete/${resourceId}`);
      fetchResources();
      // Remove from selected if it was selected
      setSelectedResources((prev) => prev.filter((id) => id !== resourceId));
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete resource"
      );
    } finally {
      setOpenConfirmModal(false);
      setDeletingResource(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingResource) {
      handleDeleteResource(deletingResource.resource_id);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedResources.length === 0) {
      toast.error("No resources selected for bulk action");
      return;
    }

    setBulkActionLoading(true);
    try {
      if (action === "download") {
        // Handle bulk download
        toast.info(`Downloading ${selectedResources.length} resources...`);
      } else if (action === "delete") {
        // Handle bulk delete
        const promises = selectedResources.map((resourceId) =>
          api.delete(`/resources/delete/${resourceId}`)
        );

        await Promise.all(promises);
        toast.success(
          `${selectedResources.length} resources deleted successfully`
        );
        fetchResources();
        setSelectedResources([]);
      }
    } catch (error) {
      console.error("Error in bulk action:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to perform bulk action"
      );
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleDownloadResource = async (resource) => {
    try {
      const response = await api.get(
        `/resources/download/${resource.resource_id}`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${resource.title}.${resource.type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Download started");
    } catch (error) {
      console.error("Error downloading resource:", error);
      toast.error("Failed to download resource");
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedResources(
        filteredResources.map((resource) => resource.resource_id)
      );
    } else {
      setSelectedResources([]);
    }
  };

  const handleSelect = (resourceId) => {
    setSelectedResources((prev) =>
      prev.includes(resourceId)
        ? prev.filter((id) => id !== resourceId)
        : [...prev, resourceId]
    );
  };

  const handleModalSuccess = () => {
    fetchResources();
    setIsAddModalOpen(false);
    setEditingResource(null);
  };

  const handleModalCancel = () => {
    setIsAddModalOpen(false);
    setEditingResource(null);
  };

  // Filter resources
  const filteredResources = resources.filter((resource) => {
    if (!resource) return false;

    const matchesSearch =
      (resource.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (resource.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (resource.course || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (resource.author || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (resource.tags || []).some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesType =
      filters.type === "all" || resource.type === filters.type;

    const matchesCourse =
      filters.course === "all" || resource.course === filters.course;

    return matchesSearch && matchesType && matchesCourse;
  });

  // Get unique file types for filter
  const fileTypes = [...new Set(resources.map((r) => r.type).filter(Boolean))];

  // Get unique courses for filter
  const courses = [...new Set(resources.map((r) => r.course).filter(Boolean))];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Resource Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and organize educational resources
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload Resource</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalResources}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Resources</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500">
                  <File className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.byType.pdf || 0}
                </div>
              </div>
              <p className="text-gray-600 text-sm">PDF Documents</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.recentUploads}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Recent (7 days)</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500">
                  <Folder className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalSize}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Storage</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search resources by title, description, course, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filters.type}
                  onChange={(e) =>
                    setFilters({ ...filters, type: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All File Types</option>
                  {fileTypes.map((type) => (
                    <option key={type} value={type}>
                      .{type.toUpperCase()}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.course}
                  onChange={(e) =>
                    setFilters({ ...filters, course: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Courses</option>
                  {courses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* View Toggle and Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveView("list")}
                    className={`p-2 rounded-md transition-colors ${
                      activeView === "list"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setActiveView("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      activeView === "grid"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Grid
                  </button>
                </div>

                {/* Actions */}
                <button
                  onClick={() => handleBulkAction("download")}
                  disabled={selectedResources.length === 0}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Download selected"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div className="text-sm text-gray-500">
                Showing {filteredResources.length} of {resources.length}{" "}
                resources
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedResources.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 font-medium">
                    {selectedResources.length} resources selected
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    disabled={bulkActionLoading}
                    onClick={() => handleBulkAction("download")}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bulkActionLoading ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-1" />
                    )}
                    Download Selected
                  </button>
                  <button
                    disabled={bulkActionLoading}
                    onClick={() => {
                      if (selectedResources.length > 0) {
                        toast.info(
                          "Bulk delete would delete multiple resources. Please delete individually or implement bulk delete API."
                        );
                      }
                    }}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bulkActionLoading ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4 mr-1" />
                    )}
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && filteredResources.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading resources...</span>
            </div>
          )}

          {/* Content */}
          {!loading || filteredResources.length > 0 ? (
            <>
              {activeView === "grid" ? (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResources.map((resource) => (
                    <ResourceCard
                      key={resource.resource_id}
                      resource={resource}
                      onEdit={setEditingResource}
                      onDelete={(resource) => {
                        setDeletingResource(resource);
                        setOpenConfirmModal(true);
                      }}
                      onDownload={handleDownloadResource}
                    />
                  ))}
                </div>
              ) : (
                // Table View
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={
                                filteredResources.length > 0 &&
                                selectedResources.length ===
                                  filteredResources.length
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              aria-label="Select all resources"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Resource
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Tags
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Upload Date
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredResources.map((resource) => (
                          <ResourceRow
                            key={resource.resource_id}
                            resource={resource}
                            selected={selectedResources.includes(
                              resource.resource_id
                            )}
                            onSelect={handleSelect}
                            onEdit={setEditingResource}
                            onDelete={(resource) => {
                              setDeletingResource(resource);
                              setOpenConfirmModal(true);
                            }}
                            onDownload={handleDownloadResource}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredResources.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No resources found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ||
                    filters.type !== "all" ||
                    filters.course !== "all"
                      ? "Try adjusting your search or filters"
                      : "Get started by uploading your first resource"}
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Upload Resource
                  </button>
                </div>
              )}
            </>
          ) : null}

          {/* Add/Edit Modal */}
          {(isAddModalOpen || editingResource) && (
            <ResourceForm
              resource={editingResource}
              onCancel={handleModalCancel}
              onSuccess={handleModalSuccess}
            />
          )}

          {/* Confirm Delete Modal */}
          {openConfirmModal && deletingResource && (
            <ConfirmModal
              title="Delete Resource"
              message={`Are you sure you want to delete "${deletingResource.title}"? This action cannot be undone. The file will be permanently removed.`}
              variant="danger"
              isOpen={openConfirmModal}
              onConfirm={handleConfirmDelete}
              onClose={() => {
                setOpenConfirmModal(false);
                setDeletingResource(null);
              }}
              confirmText="Delete Resource"
              cancelText="Cancel"
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ResourcesPage;

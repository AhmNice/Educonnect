import React from "react";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { X, Users, BookOpen, FileText, Tag, Plus } from "lucide-react";
import { useCourseStore } from "../../store/courseStore";
import { useEffect } from "react";
import { useGroupStore } from "../../store/groupStore";

const CreateGroup = ({ onClose }) => {
  const { user } = useAuthStore();
  const { courses, getAllCourses } = useCourseStore();
  const { createGroup } = useGroupStore();
  const [formData, setFormData] = useState({
    group_name: "",
    description: "",
    course_id: "",
    max_members: "",
    meeting_schedule: "",
    created_by: user?.user_id,
  });
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const refreshCourse = async () => {
      try {
        await getAllCourses(true);
      } catch (error) {
        console.log(error.message);
      }
    };
    refreshCourse();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Combine form data with tags
    const submitData = {
      ...formData,
      tags: tags,
    };
    console.log(submitData);
    try {
      const response = await createGroup(submitData);
      if (response.success) {
        return onClose();
      }
      return;
    } catch (error) {
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 w-full h-full bg-black/50 flex justify-center items-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Create Study Group
              </h2>
              <p className="text-sm text-gray-600">
                Start collaborating with your peers
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Group Name */}
          <div>
            <label
              htmlFor="group_name"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Group Name *
            </label>
            <div className="relative">
              <Users className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                id="group_name"
                name="group_name"
                value={formData.group_name}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., CS-201 Study Group"
              />
            </div>
          </div>

          {/* Course */}
          <div>
            <label
              htmlFor="course"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Course *
            </label>
            <div className="relative">
              <BookOpen className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                id="course"
                name="course_id"
                value={formData.course_id}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="e.g., Data Structures"
              >
                <option>select course</option>
                {courses.map((course) => (
                  <option key={course.course_id} value={course.course_id}>
                    {course.course_title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Max Members */}
          <div>
            <label
              htmlFor="max_members"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Maximum Members
            </label>
            <select
              id="max_members"
              name="max_members"
              value={formData.max_members}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">No limit</option>
              <option value="5">5 members</option>
              <option value="10">10 members</option>
              <option value="15">15 members</option>
              <option value="20">20 members</option>
            </select>
          </div>

          {/* Meeting Schedule */}
          <div>
            <label
              htmlFor="meeting_schedule"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Meeting Schedule
            </label>
            <input
              type="text"
              id="meeting_schedule"
              name="meeting_schedule"
              value={formData.meeting_schedule}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="e.g., Every Monday 3:00 PM"
            />
          </div>

          {/* Tags */}
          <div>
            <label
              htmlFor="tags"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tags
            </label>
            <div className="space-y-2">
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInputKeyDown}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Add tags (e.g., algorithms, homework, exam-prep)"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim()}
                  className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>

              {/* Display Tags */}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center space-x-1"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-indigo-600 focus:outline-none"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Press Enter or click Add to include tags. Tags help others find
              your group.
            </p>
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Description *
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-vertical"
                placeholder="Describe the purpose of this study group, topics you'll cover, and expectations for members..."
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isLoading ||
                !formData.group_name ||
                !formData.course_id ||
                !formData.description
              }
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Creating...</span>
                </>
              ) : (
                <span>Create Group</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;

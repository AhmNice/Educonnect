import React, { useState } from "react";
import { X, BookOpen, Hash, Type, Building, Calendar } from "lucide-react";
import { useEffect } from "react";
import { useCourseStore } from "../../store/courseStore";
import { useAuthStore } from "../../store/authStore";

const AddCourseModal = ({ onClose, purpose = "create", course }) => {
  const { user } = useAuthStore();
  const [formData, setFormData] = useState({
    course_code: purpose === "edit" ? course.course_code || "" : "",
    course_title: purpose === "edit" ? course.course_title || "" : "",
    department: purpose === "edit" ? course.department || "" : "",
    semester: purpose === "edit" ? course.semester || "" : "",
    user_id: user.user_id,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const { addCourse, updateCourse } = useCourseStore();
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const course_response = await fetch("/data/courses.json");
        if (!course_response.ok) throw new Error("Failed to fetch courses");
        const data = await course_response.json();
        setDepartments(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourse();
  }, []);

  const semesters = ["First Semester", "Second Semester"];

  // Check if form is empty
  const isFormEmpty =
    !formData.course_code.trim() ||
    !formData.course_title.trim() ||
    !formData.department ||
    !formData.semester;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.course_code.trim()) {
      newErrors.course_code = "Course code is required";
    } else if (!/^[A-Z]{2,4}-\d{4}$/.test(formData.course_code)) {
      newErrors.course_code = "Course code format: ABC-123";
    }

    if (!formData.course_title.trim()) {
      newErrors.course_title = "Course title is required";
    } else if (formData.course_title.length < 5) {
      newErrors.course_title = "Course title must be at least 5 characters";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.semester) {
      newErrors.semester = "Semester is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const response =
        purpose === "create"
          ? await addCourse(formData)
          : await updateCourse(course.course_id, formData);
      if (!response.success) {
        return;
      }
      onClose();
    } catch (err) {
      setErrors({
        submit: err.response?.data?.message || "Failed to create course",
      });
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
              <BookOpen className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Add New Course
              </h2>
              <p className="text-sm text-gray-600">Create a new course entry</p>
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
          {/* Course Code */}
          <div>
            <label
              htmlFor="course_code"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Course Code *
            </label>
            <div className="relative">
              <Hash className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                id="course_code"
                name="course_code"
                value={formData.course_code}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border text-sm ${
                  errors.course_code
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                placeholder="e.g., CS-201"
                disabled={isLoading}
              />
            </div>
            {errors.course_code && (
              <p className="mt-1 text-sm text-red-600">{errors.course_code}</p>
            )}
          </div>

          {/* Course Title */}
          <div>
            <label
              htmlFor="course_title"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Course Title *
            </label>
            <div className="relative">
              <Type className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                id="course_title"
                name="course_title"
                value={formData.course_title}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border text-sm ${
                  errors.course_title
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                placeholder="e.g., Data Structures and Algorithms"
                disabled={isLoading}
              />
            </div>
            {errors.course_title && (
              <p className="mt-1 text-sm text-red-600">{errors.course_title}</p>
            )}
          </div>

          {/* Department */}
          <div>
            <label
              htmlFor="department"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Department *
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border text-sm ${
                  errors.department
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                } rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                disabled={isLoading}
              >
                <option value="">Select Department</option>
                {departments?.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            {errors.department && (
              <p className="mt-1 text-sm text-red-600">{errors.department}</p>
            )}
          </div>

          {/* Semester */}
          <div>
            <label
              htmlFor="semester"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Semester *
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border text-sm ${
                  errors.semester
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300 focus:ring-indigo-500"
                } rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
                disabled={isLoading}
              >
                <option value="">Select Semester</option>
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>
            {errors.semester && (
              <p className="mt-1 text-sm text-red-600">{errors.semester}</p>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600 text-center">
                {errors.submit}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-300"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || isFormEmpty}
              className="flex-1 bg-gradient-to-r disabled:cursor-not-allowed from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {purpose === "create" ? (
                    <span>Creating...</span>
                  ) : (
                    <span>Updating...</span>
                  )}
                </>
              ) : purpose === "create" ? (
                <span>Create Course</span>
              ) : (
                <span>Update Course</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCourseModal;

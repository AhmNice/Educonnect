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
  BookOpen,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Award,
  Tag,
  Building,
  ChevronDown,
  MoreVertical,
  Loader2,
  Copy,
  Lock,
  Unlock,
  FileText,
  BarChart,
  TrendingUp,
} from "lucide-react";
import PageLayout from "../../layout/PageLayout";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import { useUniversityStore } from "../../store/universityStore";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { useCourseStore } from "../../store/courseStore";
import CourseCard from "../../components/cards/CourseCard";

// Course Form Component
const CourseForm = ({ course, onCancel, onSuccess, universities }) => {
  const [formData, setFormData] = useState(
    course || {
      course_code: "",
      course_title: "",
      description: "",
      department: "",
    }
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.course_code.trim())
      newErrors.course_code = "Course code is required";
    if (!formData.course_title.trim())
      newErrors.course_title = "Course title is required";
    if (!formData.description?.trim())
      newErrors.description = "Description is required";
    if (!formData.department?.trim())
      newErrors.department = "Department is required";
    return newErrors;
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
      if (course) {
        const { data } = await api.put(
          `/courses/update/${course.course_id}`,
          formData
        );

        if (!data.success) {
          throw new Error(data.message || "Failed to update course");
        }

        toast.success("Course updated successfully");
      } else {
        const { data } = await api.post("/courses/create", formData);

        if (!data.success) {
          throw new Error(data.message || "Failed to create course");
        }

        toast.success("Course created successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving course:", error);
      toast.error(
        error.response?.data?.message || error.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {course ? "Edit Course" : "Add New Course"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Code *
              </label>
              <input
                type="text"
                value={formData.course_code}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    course_code: e.target.value.toUpperCase(),
                  });
                  if (errors.course_code)
                    setErrors({ ...errors, course_code: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.course_code ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="CSC-2018"
                disabled={loading}
              />
              {errors.course_code && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.course_code}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                value={formData.course_title}
                onChange={(e) => {
                  setFormData({ ...formData, course_title: e.target.value });
                  if (errors.course_title)
                    setErrors({ ...errors, course_title: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.course_title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Data Structures and Algorithms"
                disabled={loading}
              />
              {errors.course_title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.course_title}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description || ""}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description)
                  setErrors({ ...errors, description: undefined });
              }}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Brief description of the course..."
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department *
              </label>
              <input
                type="text"
                value={formData.department || ""}
                onChange={(e) => {
                  setFormData({ ...formData, department: e.target.value });
                  if (errors.department)
                    setErrors({ ...errors, department: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.department ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Computer Science"
                disabled={loading}
              />
              {errors.department && (
                <p className="text-red-500 text-sm mt-1">{errors.department}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Semester
              </label>
              <select
                value={formData.semester || "First Semester"}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="First Semester">First Semester</option>
                <option value="Second Semester">Second Semester</option>
                <option value="Third Semester">Third Semester</option>
                <option value="Fourth Semester">Fourth Semester</option>
                <option value="Summer Semester">Summer Semester</option>
              </select>
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
                  {course ? "Updating..." : "Creating..."}
                </>
              ) : course ? (
                "Update Course"
              ) : (
                "Create Course"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Course Table Row Component
const CourseRow = React.memo(
  ({ course, selected, onSelect, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
      }
    };

    const getSemesterColor = (semester) => {
      if (!semester) return "bg-gray-100 text-gray-800";
      if (semester.toLowerCase().includes("first"))
        return "bg-blue-100 text-blue-800";
      if (semester.toLowerCase().includes("second"))
        return "bg-green-100 text-green-800";
      if (semester.toLowerCase().includes("third"))
        return "bg-orange-100 text-orange-800";
      if (semester.toLowerCase().includes("fourth"))
        return "bg-purple-100 text-purple-800";
      if (semester.toLowerCase().includes("summer"))
        return "bg-yellow-100 text-yellow-800";
      return "bg-gray-100 text-gray-800";
    };

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
            onChange={() => onSelect(course.course_id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={`Select ${course.course_title}`}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {course.course_title}
              </div>
              <div className="text-sm text-gray-500 font-mono">
                {course.course_code}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{course.department || "N/A"}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSemesterColor(
              course.semester
            )}`}
          >
            {course.semester || "N/A"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(course.created_at)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => onEdit(course)}
              className="text-green-600 hover:text-green-900 transition-colors"
              aria-label="Edit course"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(course)}
              className="text-red-600 hover:text-red-900 transition-colors"
              aria-label="Delete course"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

CourseRow.displayName = "CourseRow";

const CoursesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [activeView, setActiveView] = useState("list");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const { getAllCourses, courses } = useCourseStore();
  const [loading, setLoading] = useState(false);
  const [deletingCourse, setDeletingCourse] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeCourses: 0,
    enrolledStudents: 0,
    averageRating: 0,
  });

  const { universities, getAllUniversities } = useUniversityStore();
  const [filters, setFilters] = useState({
    semester: "all",
    department: "all",
  });

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      await getAllCourses();

      // Calculate stats based on actual data
      const total = courses.length;
      const active = courses.filter((c) => c.is_active).length;
      const enrolled = courses.reduce(
        (sum, c) => sum + (c.enrolled_count || 0),
        0
      );
      const ratings = courses.filter((c) => c.rating).map((c) => c.rating);
      const averageRating =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
          : 0;

      setStats({
        totalCourses: total,
        activeCourses: active,
        enrolledStudents: enrolled,
        averageRating: parseFloat(averageRating.toFixed(1)),
      });
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load courses"
      );
    } finally {
      setLoading(false);
    }
  }, [getAllCourses, courses]);

  useEffect(() => {
    fetchCourses();
    getAllUniversities();
  }, [fetchCourses, getAllUniversities]);

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) return;

    try {
      const { data } = await api.delete(`/courses/delete/${courseId}`);
      if (!data.success) {
        throw new Error(data.message || "Failed to delete course");
      }

      toast.success("Course deleted successfully");
      fetchCourses();
      // Remove from selected if it was selected
      setSelectedCourses((prev) => prev.filter((id) => id !== courseId));
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete course"
      );
    } finally {
      setOpenConfirmModal(false);
      setDeletingCourse(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingCourse) {
      handleDeleteCourse(deletingCourse.course_id);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedCourses(filteredCourses.map((course) => course.course_id));
    } else {
      setSelectedCourses([]);
    }
  };

  const handleSelect = (courseId) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handleModalSuccess = () => {
    fetchCourses();
    setIsAddModalOpen(false);
    setEditingCourse(null);
  };

  const handleModalCancel = () => {
    setIsAddModalOpen(false);
    setEditingCourse(null);
  };

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    if (!course) return false;

    const matchesSearch =
      (course.course_title || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (course.course_code || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (course.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (course.department || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesSemester =
      filters.semester === "all" || course.semester === filters.semester;

    const matchesDepartment =
      filters.department === "all" || course.department === filters.department;

    return matchesSearch && matchesSemester && matchesDepartment;
  });

  // Get unique departments for filter
  const departments = [
    ...new Set(courses.map((c) => c.department).filter(Boolean)),
  ];

  // Get unique semesters for filter
  const semesters = [...new Set(courses.map((c) => c.semester).filter(Boolean))];

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Course Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and organize academic courses
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add Course</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalCourses}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Courses</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.activeCourses}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Active Courses</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.enrolledStudents}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Enrolled Students</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.averageRating}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Average Rating</p>
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
                  placeholder="Search courses by title, code, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filters.semester}
                  onChange={(e) =>
                    setFilters({ ...filters, semester: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Semesters</option>
                  {semesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.department}
                  onChange={(e) =>
                    setFilters({ ...filters, department: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
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
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Upload"
                >
                  <Upload className="w-5 h-5" />
                </button>
              </div>

              <div className="text-sm text-gray-500">
                Showing {filteredCourses.length} of {courses.length} courses
              </div>
            </div>
          </div>

          {/* Bulk Selection Info */}
          {selectedCourses.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 font-medium">
                    {selectedCourses.length} courses selected
                  </span>
                </div>
                <button
                  onClick={() => setSelectedCourses([])}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Clear selection
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && filteredCourses.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">Loading courses...</span>
            </div>
          )}

          {/* Content */}
          {!loading || filteredCourses.length > 0 ? (
            <>
              {activeView === "grid" ? (
                // Grid View using CourseCard component
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.course_id}
                      course={course}
                      handleEditCourse={setEditingCourse}
                      handleToCourseDelete={() => {
                        setDeletingCourse(course);
                        setOpenConfirmModal(true);
                      }}
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
                                filteredCourses.length > 0 &&
                                selectedCourses.length ===
                                  filteredCourses.length
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              aria-label="Select all courses"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Course
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Semester
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCourses.map((course) => (
                          <CourseRow
                            key={course.course_id}
                            course={course}
                            selected={selectedCourses.includes(
                              course.course_id
                            )}
                            onSelect={handleSelect}
                            onEdit={setEditingCourse}
                            onDelete={(course) => {
                              setDeletingCourse(course);
                              setOpenConfirmModal(true);
                            }}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredCourses.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No courses found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || filters.semester !== "all" || filters.department !== "all"
                      ? "Try adjusting your search or filters"
                      : "Get started by adding your first course"}
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add Course
                  </button>
                </div>
              )}
            </>
          ) : null}

          {/* Add/Edit Modal */}
          {(isAddModalOpen || editingCourse) && (
            <CourseForm
              course={editingCourse}
              onCancel={handleModalCancel}
              onSuccess={handleModalSuccess}
              universities={universities}
            />
          )}

          {/* Confirm Delete Modal */}
          {openConfirmModal && deletingCourse && (
            <ConfirmModal
              title="Delete Course"
              message={`Are you sure you want to delete "${deletingCourse.course_title}"? This action cannot be undone.`}
              variant="danger"
              isOpen={openConfirmModal}
              onConfirm={handleConfirmDelete}
              onClose={() => {
                setOpenConfirmModal(false);
                setDeletingCourse(null);
              }}
              confirmText="Delete Course"
              cancelText="Cancel"
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default CoursesPage;
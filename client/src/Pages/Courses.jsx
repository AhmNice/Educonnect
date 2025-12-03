import React, { useState, useEffect } from "react";
import PageLayout from "../layout/PageLayout";
import CourseCard from "../components/cards/CourseCard";
import {
  Search,
  BookOpen,
  Plus,
  Filter,
  Calendar,
  Building,
} from "lucide-react";
import AddCourseModal from "../components/modal/AddCourse";
import { useCourseStore } from "../store/courseStore";
import ConfirmModal from "../components/modal/ConfirmModal";
import { toast } from "react-toastify";

const Courses = () => {
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { courses, getAllCourses, loadingCourses, deleteCourse } =
    useCourseStore(); // Make sure deleteCourse is in your store
  const [filters, setFilters] = useState({
    department: "all",
    semester: "all",
  });
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);
  const [courseToDelete, setCourseToDelete] = useState(null);
  const [purpose, setPurpose] = useState("create");
  const [deleting, setDeleting] = useState(false);

  const handleEditCourse = (course) => {
    setCourseToEdit(course);
    setPurpose("edit");
    setShowAddCourseModal(true);
  };

  const handleToCourseDelete = (course_id) => {
    console.log(course_id);
    setCourseToDelete(course_id);
    setShowConfirmModal(true);
  };

  const handleAddCourse = () => {
    setPurpose("create");
    setCourseToEdit(null);
    setShowAddCourseModal(true);
  };

  const handleCloseAddModal = () => {
    setShowAddCourseModal(false);
    setCourseToEdit(null);
    setPurpose("create");
  };

  const handleCloseConfirmModal = () => {
    setCourseToDelete(null);
    setShowConfirmModal(false);
  };

  const handleDeleteCourse = async () => {
    if (!courseToDelete) return;

    setDeleting(true);
    try {
      const response = await deleteCourse(courseToDelete);
      if (response.success) {
        handleCloseConfirmModal();
      }
    } catch (error) {
      console.log("Error deleting course:", error.message);
    } finally {
      setDeleting(false);
    }
  };

  // Mock data - only used as fallback
  const mockCourses = [
    {
      course_id: "1",
      course_code: "CS-201",
      course_title: "Data Structures and Algorithms",
      department: "Computer Science",
      semester: "Spring 2024",
      created_at: "2024-01-15T10:00:00Z",
      updated_at: "2024-01-15T10:00:00Z",
    },
    // ... rest of your mock data
  ];

  // Calculate available departments and semesters from actual data
  const availableDepartments = [
    ...new Set(
      (courses.length > 0 ? courses : mockCourses).map(
        (course) => course.department
      )
    ),
  ];
  const availableSemesters = [
    ...new Set(
      (courses.length > 0 ? courses : mockCourses).map(
        (course) => course.semester
      )
    ),
  ];

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

  useEffect(() => {
    // Use courses from store if available, otherwise use mock data
    const dataToUse = courses.length > 0 ? courses : mockCourses;
    let results = dataToUse;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (course) =>
          course.course_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.course_title
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          course.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply department filter
    if (filters.department !== "all") {
      results = results.filter(
        (course) => course.department === filters.department
      );
    }

    // Apply semester filter
    if (filters.semester !== "all") {
      results = results.filter(
        (course) => course.semester === filters.semester
      );
    }

    setFilteredCourses(results);
  }, [courses, searchTerm, filters]);

  // Calculate stats based on actual data being used
  const dataForStats = courses.length > 0 ? courses : mockCourses;
  const stats = {
    total: dataForStats.length,
    departments: availableDepartments.length,
    semesters: availableSemesters.length,
  };

  // Use dataForStats instead of courses in the results count
  const displayCourses = courses.length > 0 ? courses : mockCourses;

  if (loadingCourses || isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-24"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-gray-200 rounded-2xl h-64"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {showAddCourseModal && (
        <AddCourseModal
          purpose={purpose}
          course={courseToEdit}
          onClose={handleCloseAddModal}
        />
      )}

      <ConfirmModal
        isOpen={showConfirmModal}
        onConfirm={handleDeleteCourse}
        onClose={handleCloseConfirmModal}
        confirmText="Delete Course"
        title="Delete Course"
        variant="danger"
        message="Are you sure you want to delete this course? This action cannot be undone."
        cancelText="Cancel"
        isLoading={deleting}
      />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <BookOpen className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-900">Courses</h1>
              </div>
              <p className="text-gray-600">
                Browse and manage all available courses
              </p>
            </div>
            <button
              onClick={handleAddCourse}
              className="mt-4 lg:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Add New Course</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.total}
                  </p>
                  <p className="text-sm text-gray-600">Total Courses</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Building className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.departments}
                  </p>
                  <p className="text-sm text-gray-600">Departments</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {stats.semesters}
                  </p>
                  <p className="text-sm text-gray-600">Active Semesters</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by course code, title, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={filters.department}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      department: e.target.value,
                    }))
                  }
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Departments</option>
                  {availableDepartments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.semester}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      semester: e.target.value,
                    }))
                  }
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="all">All Semesters</option>
                  {availableSemesters.map((sem) => (
                    <option key={sem} value={sem}>
                      {sem}
                    </option>
                  ))}
                </select>

                <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>Sort By</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredCourses.length} of {displayCourses.length}{" "}
              courses
              {searchTerm && ` for "${searchTerm}"`}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>

          {/* Courses Grid */}
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.course_id}
                  course={course}
                  handleToCourseDelete={handleToCourseDelete}
                  handleEditCourse={handleEditCourse}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "No courses found" : "No courses available"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Add the first course to get started"}
              </p>
              <button
                onClick={handleAddCourse}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                Add New Course
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Courses;

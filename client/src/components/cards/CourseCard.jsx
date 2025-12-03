import React from "react";
import { BookOpen, Calendar, Building } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const CourseCard = ({ course, handleEditCourse, handleToCourseDelete }) => {
  const { user } = useAuthStore();
  const getDepartmentColor = (department) => {
    const colors = {
      "Computer Science": "bg-blue-100 text-blue-800",
      Mathematics: "bg-green-100 text-green-800",
      Physics: "bg-purple-100 text-purple-800",
      Chemistry: "bg-orange-100 text-orange-800",
      Biology: "bg-emerald-100 text-emerald-800",
      English: "bg-red-100 text-red-800",
      History: "bg-amber-100 text-amber-800",
      Psychology: "bg-pink-100 text-pink-800",
      Economics: "bg-indigo-100 text-indigo-800",
      Engineering: "bg-cyan-100 text-cyan-800",
    };
    return colors[department] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {course.course_code}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {course.course_title}
          </p>
        </div>
      </div>

      {/* Department Badge */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDepartmentColor(
            course.department
          )}`}
        >
          <Building className="w-3 h-3 mr-1" />
          {course.department}
        </span>
      </div>

      {/* Course Info */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4" />
          <span>{course.semester}</span>
        </div>

        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4" />
          <span>
            Created: {new Date(course.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-2 mt-4">
        {user.role == "admin" && (
          <button
            onClick={() => {
              handleToCourseDelete(course.course_id);
            }}
            className="flex-1 bg-red-500 text-white py-2 px-2 rounded-xl font-medium hover:bg-gray-200 transition-colors text-sm"
          >
            Delete Course
          </button>
        )}
        <button
          onClick={() => {
            handleEditCourse(course);
          }}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2 px-2 rounded-xl font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 text-sm"
        >
          Edit Course
        </button>
      </div>
    </div>
  );
};

export default CourseCard;

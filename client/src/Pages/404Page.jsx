import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, GraduationCap } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const NotFound = () => {
  const { user } = useAuthStore();
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
          <GraduationCap className="w-10 h-10 text-white" />
        </div>

        {/* Content */}
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          The page you're looking for doesn't exist or has been moved. Let's get
          you back to your studies.
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
            className="inline-flex items-center justify-center w-full bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

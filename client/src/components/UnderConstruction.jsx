import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Construction } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const UnderConstruction = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-sm w-full text-center">
        {/* Icon */}
        <div className="mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Construction className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        {/* Content */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Under Construction
        </h1>
        <p className="text-gray-600 mb-8">
          This feature is currently being developed. We're working hard to bring
          it to you soon!
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Link
            to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
            className="inline-flex items-center justify-center w-full bg-orange-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full border border-gray-300 text-gray-700 px-4 py-3 rounded-lg font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnderConstruction;

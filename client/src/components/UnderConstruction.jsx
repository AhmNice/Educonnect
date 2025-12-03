import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Construction, Clock, AlertCircle } from "lucide-react";
import { useAuthStore } from "../store/authStore";


const UnderConstructionPage = () => {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg relative">
          <Construction className="w-10 h-10 text-white" />
          {/* Animated dots */}
          <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full animate-pulse"></div>
          <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
        </div>

        {/* Content */}
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Under Construction
        </h1>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          We're Building Something Great!
        </h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          This page is currently under development. We're working hard to bring you new features and improvements. Please check back soon!
        </p>

        {/* Status Info */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-100 rounded-xl p-4 mb-8">
          <div className="flex items-center justify-center space-x-2 mb-3">
            <Clock className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              Estimated Completion: Coming Soon
            </span>
          </div>
          <div className="flex items-center justify-center space-x-2 text-sm text-orange-600">
            <AlertCircle className="w-4 h-4" />
            <span>Development in Progress</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Development Progress</span>
            <span>75%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Link
            to={user?.role === "admin" ? "/admin/dashboard" : "/dashboard"}
            className="inline-flex items-center justify-center w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-yellow-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center w-full border border-gray-300 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:border-gray-400 hover:bg-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Go Back
          </button>
        </div>

        {/* Support Link */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-2">Need help in the meantime?</p>
          <Link
            to="/support"
            className="text-orange-600 hover:text-orange-700 font-medium text-sm"
          >
            Contact Support →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UnderConstructionPage;
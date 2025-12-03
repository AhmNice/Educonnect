import React from "react";
import { useNavigate } from "react-router-dom";
import { Shield, Home, ArrowLeft, Lock, User, Users, Crown, Mail } from "lucide-react";
import { useAuthStore } from "../store/authStore";

const Unauthorized = ({ requiredRole }) => {
  const navigate = useNavigate();
  const { user} = useAuthStore();

  // Role configuration for dynamic messaging
  const roleConfig = {
    student: {
      title: "Student Access Required",
      description: "This page is available to enrolled students only. You need student privileges to access this content.",
      icon: User,
      color: "from-blue-500 to-cyan-500",
      homePath: "/dashboard"
    },
    tutor: {
      title: "Tutor Access Required",
      description: "You need tutor privileges to access this content. Tutor features include course management and student guidance.",
      icon: Users,
      color: "from-green-500 to-emerald-500",
      homePath: "/dashboard"
    },
    admin: {
      title: "Administrator Access Required",
      description: "This area is restricted to platform administrators. Administrative privileges are required for system management.",
      icon: Crown,
      color: "from-red-500 to-orange-500",
      homePath: "/admin/dashboard"
    }
  };

  const config = requiredRole ? roleConfig[user.role] : {
    title: "Access Denied",
    description: "You don't have the required permissions to view this page. Please contact your administrator if you need access.",
    icon: Shield,
    color: "from-red-500 to-orange-600",
    homePath: "/dashboard"
  };
  console.log(config)

  const RoleIcon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          {/* Icon */}
          <div className={`w-20 h-20 bg-gradient-to-r ${config.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
            <RoleIcon className="w-10 h-10 text-white" />
            {requiredRole && (
              <Lock className="w-5 h-5 text-white/80 absolute -top-1 -right-1" />
            )}
          </div>

          {/* Content */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-3">
              {config.title}
            </h1>
            <p className="text-gray-600 leading-relaxed">
              {config.description}
            </p>
          </div>

          {/* Role Information */}
          {requiredRole && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center space-x-2 text-blue-700">
                <Shield className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {requiredRole.toUpperCase()} PRIVILEGES REQUIRED
                </span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center group"
            >
              <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>

            <button
              onClick={() => navigate(config.homePath)}
              className="w-full bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-orange-600 transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center group"
            >
              <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Go to Dashboard
            </button>
          </div>

          {/* Help Section */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-4">
                Need elevated access?
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => navigate("/contact")}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  <Mail className="w-4 h-4 mr-1" />
                  Contact Support
                </button>
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-3">
            <p className="text-xs text-yellow-700 text-center">
              Unauthorized access attempts are logged for security purposes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
import React, { useEffect } from "react";
import { useAuthStore } from "../store/authStore";
import { Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";
import Unauthorized from "../Pages/UnAuthorized";
import { toast } from "react-toastify";

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, checkingAuth } = useAuthStore();
  const location = useLocation();
  // console.log(user)
  // Enhanced loading state
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <div className="absolute inset-0 bg-white/20 rounded-full blur-sm"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Checking Authentication
          </h2>
          <p className="text-gray-500">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user && !checkingAuth) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location,
          message: "Please sign in to access this page",
        }}
      />
    );
  }
  // Role-based access control
  if (requiredRole && user.role !== requiredRole) {
    return <Unauthorized requiredRole={requiredRole} />;
  }
  // Render children if all checks pass
  return <>{children}</>;
};

export default ProtectedRoute;

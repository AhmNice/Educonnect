import React from "react";
import { useAuthStore } from "../store/authStore";
import { Loader2 } from "lucide-react";
import { Navigate, useLocation } from "react-router-dom";

const UnverifiedUser = ({ children }) => {
  const { user, checkingAuth } = useAuthStore();
  const location = useLocation();

  // Show loading screen
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Checking Authentication
          </h2>
          <p className="text-gray-500">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // If not authenticated → redirect to login
  if (!user) {
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

  // If already verified → redirect to correct dashboard
  if (user.is_verified) {
    return (
      <Navigate
        to={user.role === "admin" ? "/admin/dashboard" : "/dashboard"}
        replace
      />
    );
  }

  // Otherwise → allow unverified users
  return <>{children}</>;
};

export default UnverifiedUser;

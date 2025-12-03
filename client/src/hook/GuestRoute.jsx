import React from "react";
import { useAuthStore } from "../store/authStore";
import { Navigate, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";

const GuestRoute = ({ children }) => {
  const { user, checkingAuth } = useAuthStore();
  const location = useLocation();

  // Show loading state
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Checking Access
          </h2>
          <p className="text-gray-500">Verifying your session...</p>
        </div>
      </div>
    );
  }

  // Redirect authenticated users to appropriate dashboard
  if (user) {
    const from = location.state?.from?.pathname;
    let dashboardRoute = "/dashboard";

    if (user.role === "admin") {
      dashboardRoute = "/admin/dashboard";
    }

    // Use the original intended route or fallback to dashboard
    const targetRoute = from || dashboardRoute;

    return (
      <Navigate
        to={targetRoute}
        replace
        state={{
          from: location,
          message: `Welcome back! Redirecting to your dashboard`
        }}
      />
    );
  }

  // Render children for guest users
  return <>{children}</>;
};

export default GuestRoute;
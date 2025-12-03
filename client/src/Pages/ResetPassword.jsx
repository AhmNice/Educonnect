// ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import AuthLayout from "../layout/AuthLayout";
import { useAuthStore } from "../store/authStore";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const { changePassword } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateForm = () => {
    if (!formData.password) {
      setError("Password is required");
      return false;
    }

    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return false;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError(
        "Password must contain uppercase, lowercase letters and numbers"
      );
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        token,
        email,
        password: formData.password,
      };
      const response = await changePassword(payload);
      if (!response.success) {
        setIsSuccess(false);
        return;
      }
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to reset password. The link may have expired."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Password Reset Successfully!"
        subtitle="Your password has been updated successfully"
      >
        <div className="text-center space-y-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
          <p className="text-gray-600">
            You will be redirected to the login page shortly...
          </p>
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Enter your new password below"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* New Password */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-200"
              placeholder="Enter new password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all duration-200"
              placeholder="Confirm new password"
              disabled={isLoading}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Password Requirements */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Password Requirements:
          </p>
          <ul className="text-xs text-gray-600 space-y-1">
            <li
              className={`flex items-center space-x-2 ${
                formData.password.length >= 8 ? "text-green-600" : ""
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  formData.password.length >= 8 ? "bg-green-500" : "bg-gray-400"
                }`}
              ></div>
              <span>At least 8 characters long</span>
            </li>
            <li
              className={`flex items-center space-x-2 ${
                /(?=.*[a-z])/.test(formData.password) ? "text-green-600" : ""
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  /(?=.*[a-z])/.test(formData.password)
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              ></div>
              <span>One lowercase letter</span>
            </li>
            <li
              className={`flex items-center space-x-2 ${
                /(?=.*[A-Z])/.test(formData.password) ? "text-green-600" : ""
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  /(?=.*[A-Z])/.test(formData.password)
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              ></div>
              <span>One uppercase letter</span>
            </li>
            <li
              className={`flex items-center space-x-2 ${
                /(?=.*\d)/.test(formData.password) ? "text-green-600" : ""
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  /(?=.*\d)/.test(formData.password)
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              ></div>
              <span>One number</span>
            </li>
            <li
              className={`flex items-center space-x-2 ${
                formData.password === formData.confirmPassword &&
                formData.confirmPassword
                  ? "text-green-600"
                  : ""
              }`}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  formData.password === formData.confirmPassword &&
                  formData.confirmPassword
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              ></div>
              <span>Passwords match</span>
            </li>
          </ul>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Resetting Password...</span>
            </>
          ) : (
            <span>Reset Password</span>
          )}
        </button>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;

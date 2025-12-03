import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import AuthLayout from "../layout/AuthLayout";
import { useAuthStore } from "../store/authStore";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { forgetPassword } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setIsLoading(true);
    try {
      const response = await forgetPassword(email);
      if (response.success) {
        setIsSubmitted(true);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate("/login");
  };

  if (isSubmitted) {
    return (
      <AuthLayout
        title="Check Your Email"
        subtitle="We've sent a password reset link to your email"
      >
        <div className="text-center space-y-6">
          {/* Success Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <CheckCircle className="w-16 h-16 text-green-500" />
              <div className="absolute inset-0 bg-green-100 rounded-full blur-sm"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Reset Link Sent!
            </h3>
            <p className="text-sm text-gray-600">
              We've sent a password reset link to:
              <br />
              <span className="font-medium text-indigo-600">{email}</span>
            </p>
            <p className="text-xs text-gray-500">
              The link will expire in 1 hour for security reasons.
            </p>
          </div>

          {/* Help Text */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <div className="text-xs text-blue-700">
                <strong>Didn't receive the email?</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Check your spam or junk folder</li>
                  <li>• Make sure you entered the correct email</li>
                  <li>• Wait a few minutes and try again</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <button
              onClick={() => setEmail("") & setIsSubmitted(false)}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              Resend Reset Link
            </button>

            <button
              onClick={handleBackToLogin}
              className="w-full bg-gray-100 text-gray-700 py-2.5 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 border border-gray-300"
            >
              Back to Login
            </button>
          </div>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Reset Your Password"
      subtitle="Enter your email to receive a reset link"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            University Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`block w-full pl-10 pr-3 py-3 border text-sm ${
                error
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200`}
              placeholder="you@university.edu"
              disabled={isLoading}
            />
          </div>
          {error && (
            <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </p>
          )}
        </div>

        {/* Help Text */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="text-xs text-gray-600 text-center">
            Enter the email address associated with your EduConnect account, and
            we'll send you a link to reset your password.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Sending Reset Link...</span>
            </>
          ) : (
            <span>Send Reset Link</span>
          )}
        </button>

        {/* Back to Login */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="inline-flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Login</span>
          </button>
        </div>

        {/* Support Contact */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help?{" "}
            <a
              href="mailto:support@educconnect.com"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default RequestPasswordReset;

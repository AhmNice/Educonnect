import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Loader2,
  Clock,
  RefreshCw,
} from "lucide-react";
import AuthLayout from "../layout/AuthLayout";
import { useAuthStore } from "../store/authStore";

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
  const [canResend, setCanResend] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [requested, setRequested] = useState(false);

  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const { verifyOTP, resendOTP, user, requestAccountVerification } =
    useAuthStore();

  // Get email and purpose from location state or props
  const { email, purpose } = location.state || {};

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto-focus first input on mount and when OTP is cleared
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [otp]);

  // Check if we have the required email and purpose
  useEffect(() => {
    if (!email || !purpose) {
      setError("Missing required verification information. Please try again.");
    }
  }, [email, purpose]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleOtpChange = (index, value) => {
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }

    // Auto-submit when all fields are filled
    if (value && index === 5 && newOtp.every((digit) => digit !== "")) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    // Handle arrow keys for better navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    const pastedNumbers = pastedData.replace(/\D/g, "").split("").slice(0, 6);

    if (pastedNumbers.length === 6) {
      const newOtp = [...otp];
      pastedNumbers.forEach((num, index) => {
        newOtp[index] = num;
      });
      setOtp(newOtp);
      setError("");

      // Focus the last input
      inputRefs.current[5].focus();
      setTimeout(() => handleVerify(newOtp.join("")), 100);
    }
  };

  const handleVerify = async (otpCode = otp.join("")) => {
    if (otpCode.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    if (!email || !purpose) {
      setError("Missing verification context. Please try again.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await verifyOTP({
        email,
        otp: otpCode,
        purpose,
      });

      if (response.success) {
        setIsVerified(true);
        // Redirect based on purpose or to login
        setTimeout(() => {
          if (purpose === "email_verification") {
            navigate("/login");
          } else if (purpose === "password_reset") {
            navigate("/login");
          } else {
            navigate("/dashboard");
          }
        }, 2000);
      } else {
        setError(response.message || "Invalid verification code");
        // Clear OTP on error
        setOtp(["", "", "", "", "", ""]);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    if (!email || !purpose) {
      setError("Cannot resend code. Missing required information.");
      return;
    }

    setIsLoading(true);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setTimeLeft(300);
    setCanResend(false);

    try {
      const response = await resendOTP({ email, purpose });

      if (response.success) {
        // Success message handled by toast in the store
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        setError(response.message || "Failed to resend code");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to resend verification code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestOtp = async () => {
    setRequesting(true);
    setError("");
    try {
      const response = await requestAccountVerification({ email: user.email });
      if (response.success) {
        setRequested(true);
        setTimeLeft(300);
        setCanResend(false);
        // Focus first input after successful request
        setTimeout(() => {
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
          }
        }, 100);
      } else {
        setError(response.message || "Failed to request verification code");
      }
    } catch (error) {
      setError(
        error.message || "An error occurred while requesting verification"
      );
    } finally {
      setRequesting(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Show error if email or purpose is missing for non-logged in users
  if (!user && (!email || !purpose)) {
    return (
      <AuthLayout
        title="Verification Error"
        subtitle="Missing required information"
      >
        <div className="text-center space-y-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Unable to Verify
            </h3>
            <p className="text-sm text-gray-600">
              {error || "Required verification information is missing."}
            </p>
          </div>
          <button
            onClick={handleBack}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </AuthLayout>
    );
  }

  if (isVerified) {
    return (
      <AuthLayout
        title="Verification Successful!"
        subtitle={`Your email has been verified successfully`}
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
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Email Verified Successfully! ✅
            </h3>
            <p className="text-sm text-gray-600">
              {purpose === "email_verification"
                ? "Redirecting you to login..."
                : "Redirecting you to dashboard..."}
            </p>
          </div>

          {/* Loading Animation */}
          <div className="flex justify-center">
            <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
          </div>
        </div>
      </AuthLayout>
    );
  }

  // If user is already logged in and hasn't requested OTP yet
  console.log(user);
  if (user && !requested) {
    return (
      <AuthLayout title="Account Verification">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Verify Your Account
            </h3>
            <p className="text-sm text-gray-600">
              You are logged in but your account needs verification. Request a
              verification code to complete the process.
            </p>
          </div>

          <button
            onClick={handleRequestOtp}
            disabled={requesting}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
          >
            {requesting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Requesting...</span>
              </>
            ) : (
              <>
                <Mail className="w-5 h-5" />
                <span>Request Verification Code</span>
              </>
            )}
          </button>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm text-red-600 flex items-center justify-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </p>
            </div>
          )}

          <button
            onClick={() => navigate("/dashboard")}
            className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
          >
            Go to Dashboard
          </button>
        </div>
      </AuthLayout>
    );
  }

  // Determine the display email (from location state or logged-in user)
  const displayEmail = email || user?.email;

  return (
    <AuthLayout
      title="Enter Verification Code"
      subtitle={`We sent a 6-digit code to ${displayEmail}`}
    >
      <div className="space-y-6">
        {/* OTP Input Fields */}
        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700 text-center">
            Enter the code sent to your email
          </label>

          <div className="flex justify-center space-x-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200 bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
            ))}
          </div>
        </div>

        {/* Timer and Resend */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Code expires in: {formatTime(timeLeft)}</span>
          </div>

          {canResend ? (
            <button
              type="button"
              onClick={handleResendOTP}
              disabled={isLoading}
              className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className="w-4 h-4" />
              <span>{isLoading ? "Resending..." : "Resend Code"}</span>
            </button>
          ) : (
            <p className="text-sm text-gray-500">
              Didn't receive the code? Resend available in{" "}
              {formatTime(timeLeft)}
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-600 flex items-center justify-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </p>
          </div>
        )}

        {/* Security Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-blue-700">
              <strong>Security Notice:</strong>
              <ul className="mt-1 space-y-1">
                <li>• Never share this code with anyone</li>
                <li>• EduConnect will never ask for your OTP</li>
                <li>• The code expires in 5 minutes</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Verify Button */}
        <button
          onClick={() => handleVerify()}
          disabled={isLoading || otp.some((digit) => digit === "")}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <span>Verify Code</span>
          )}
        </button>

        {/* Back Button */}
        <div className="text-center pt-4">
          <button
            type="button"
            onClick={handleBack}
            disabled={isLoading}
            className="inline-flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>
        </div>

        {/* Support Contact */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Having trouble?{" "}
            <a
              href="mailto:support@educconnect.com"
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Contact Support
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default OTPVerification;

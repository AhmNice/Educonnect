import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  BookOpen,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import AuthLayout from "../layout/AuthLayout";
import { useUniversityStore } from "../store/universityStore";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    university_id: "",
    department: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { universities, getAllUniversities } = useUniversityStore();
  const { register } = useAuthStore();
  useEffect(() => {
    const fetchUniversities = async () => {
      const response = await getAllUniversities(true);
    };
    fetchUniversities();
  }, []);
  const departments = [
    "Computer Science",
    "Biology",
    "Business Administration",
    "Psychology",
    "Engineering",
    "Mathematics",
    "Economics",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = "Full name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.university_id) {
      newErrors.university = "University is required";
    }

    if (!formData.department) {
      newErrors.department = "department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await register(formData);
      if (!response.success) {
        toast.error(response.message);
        return;
      }
      navigate("/verify-otp", {
        state: {
          email: formData.email,
          purpose: "verification", // or "login", "reset", "security"
        },
      });
    } catch (error) {
      setErrors({ submit: "Registration failed. Please try again." });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Join EduConnect"
      subtitle="Create your account and start collaborating"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name Field */}
        <div>
          <label
            htmlFor="full_name"
            className="block text-xs font-medium text-gray-700 mb-1.5"
          >
            Full Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleChange}
              className={`block w-full pl-9 pr-3 py-2.5 border text-sm ${
                errors.full_name ? "border-red-300" : "border-gray-300"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
              placeholder="Enter your full name"
            />
          </div>
          {errors.full_name && (
            <p className="mt-1 text-xs text-red-600">{errors.full_name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-medium text-gray-700 mb-1.5"
          >
            University Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-9 pr-3 py-2.5 border text-sm ${
                errors.email ? "border-red-300" : "border-gray-300"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
              placeholder="you@university.edu"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* University Field */}
        <div>
          <label
            htmlFor="university_id"
            className="block text-xs font-medium text-gray-700 mb-1.5"
          >
            University
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <GraduationCap className="h-4 w-4 text-gray-400" />
            </div>
            <select
              id="university_id"
              name="university_id"
              value={formData.university_id}
              onChange={handleChange}
              className={`block w-full pl-9 pr-3 py-2.5 border text-sm ${
                errors.university ? "border-red-300" : "border-gray-300"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white`}
            >
              <option value="">Select your university</option>
              {universities.map((uni) => (
                <option key={uni.university_id} value={uni.university_id}>
                  {uni.name}
                </option>
              ))}
            </select>
          </div>
          {errors.university && (
            <p className="mt-1 text-xs text-red-600">{errors.university}</p>
          )}
        </div>

        {/* department Field */}
        <div>
          <label
            htmlFor="department"
            className="block text-xs font-medium text-gray-700 mb-1.5"
          >
            department/Field of Study
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BookOpen className="h-4 w-4 text-gray-400" />
            </div>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={`block w-full pl-9 pr-3 py-2.5 border text-sm ${
                errors.department ? "border-red-300" : "border-gray-300"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white`}
            >
              <option value="">Select your department</option>
              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </div>
          {errors.department && (
            <p className="mt-1 text-xs text-red-600">{errors.department}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-xs font-medium text-gray-700 mb-1.5"
          >
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className={`block w-full pl-9 pr-10 py-2.5 border text-sm ${
                errors.password ? "border-red-300" : "border-gray-300"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
              placeholder="Create a password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-xs font-medium text-gray-700 mb-1.5"
          >
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-4 w-4 text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full pl-9 pr-10 py-2.5 border text-sm ${
                errors.confirmPassword ? "border-red-300" : "border-gray-300"
              } rounded-xl placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-xs text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start space-x-2 text-sm">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="h-3.5 w-3.5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-0.5"
            required
          />
          <label
            htmlFor="terms"
            className="text-xs text-gray-700 leading-relaxed"
          >
            I agree to the{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Terms of Service
            </a>{" "}
            and{" "}
            <a
              href="#"
              className="text-indigo-600 hover:text-indigo-500 font-medium"
            >
              Privacy Policy
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-2.5 px-4 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 flex items-center justify-center space-x-2 text-sm"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating account...</span>
            </>
          ) : (
            <>
              <span>Create Account</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </>
          )}
        </button>

        {errors.submit && (
          <div className="rounded-xl bg-red-50 p-3 border border-red-200">
            <p className="text-xs text-red-600 text-center">{errors.submit}</p>
          </div>
        )}

        {/* Login Link */}
        <div className="text-center pt-2">
          <p className="text-xs text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Signup;

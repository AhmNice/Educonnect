import axios from "axios";
import { toast } from "react-toastify";
import { resetAuthState } from './authAction'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  withCredentials: true,
});

// Define guest/public routes
const guestPages = [
  "/", "/login", "/signup",
  "/reset-password", "/request-password-reset",
  "/verify-otp"
];

// Interceptor for 401 & 403 errors
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error?.response?.status;
    const message = error?.response?.data?.message;
    const currentPath = window.location.pathname;

    // Only handle when unauthorized
    if (status === 401 || status === 403) {

      // Show toast ONLY if the user is not on a guest route
      if (!guestPages.includes(currentPath)) {
        toast.warn(message || "Session expired, please login again.");
      }
      // Reset Zustand auth state
      resetAuthState();
    }
      return Promise.reject(error);
  }
);

export default api;

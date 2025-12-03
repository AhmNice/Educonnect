import axios from 'axios'
import { toast } from 'react-toastify'
import { create } from 'zustand'
axios.defaults.withCredentials = true

const initialState = {
  user: null,
  loadingUser: false,
  checkingAuth: true,
  authenticated: false,
  userSuccess: null,
  userError: null
}

const AUTH_ENDPOINT = `${import.meta.env.VITE_SERVER_URL}`

export const useAuthStore = create((set, get) => ({
  ...initialState,

  loginUser: async (payload) => {
    set({ loadingUser: true, userSuccess: null, userError: null });

    try {
      const { data } = await axios.post(
        `${AUTH_ENDPOINT}/user-login`,
        payload
      );

      if (!data.success) {
        set({ loadingUser: false, userError: data.message });
        toast.error(data.message);
        return { success: false, message: data.message };
      }

      toast.success(data.message);
      set({
        loadingUser: false,
        userSuccess: data.message,
        user: data.user,
        userError: null
      });

      return {
        success: true,
        message: data.message,
        route: data.user.role === "admin" ? "/admin/dashboard" : "/dashboard"
      };

    } catch (error) {
      console.error('Login error:', error);
      const errMsg = error?.response?.data?.message || "Network Error";

      set({ loadingUser: false, userError: errMsg });
      toast.error(errMsg);
      return { success: false, message: errMsg };
    }
  },

  checkAuth: async ({ location = { pathname: '/' }, showToast = true } = {}) => {
    set({ checkingAuth: true, userError: null });
    try {
      const { data } = await axios.get(`${AUTH_ENDPOINT}/users/get-authenticated-user`);
      if (data.success) {
        set({ user: data.user, authenticated: true, checkingAuth: false });
        return { success: true, user: data.user };
      } else {
        throw new Error(data.message || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // Handle different error types
      if (error.response) {
        // Server responded with error status
        if ([401, 403].includes(error.response.status)) {
          const guestPage = ["/", "/login", "/signup", "/reset-password", "/request-password-reset", "/verify-otp"];
          if (showToast && !guestPage.includes(location.pathname)) {
            toast.warn("Session expired, please log in again.");
          }
        } else {
          // Other server errors (500, 404, etc.)
          set({ userError: error.response.data?.message || 'Server error' });
        }
      } else {
        // Network errors or other issues
        set({ userError: 'Unable to connect to server' });
      }
      return { success: false, error: error.message };
    } finally {
      set({ checkingAuth: false });
    }
  },

  logoutUser: async (isManual = true) => {
    try {
      await axios.post(
        `${AUTH_ENDPOINT}/users/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error('Logout error:', error);
      if (error.response && ![401, 403].includes(error.response.status)) {
        if (isManual) toast.error(error?.response?.data?.message || "Logout failed");
      }
    } finally {
      // Reset all auth-related state
      set({
        user: null,
        authenticated: false,
        userSuccess: null,
        userError: null,
        loadingUser: false
      });

      if (isManual) toast.success("Logged out successfully.");
    }
  },
  // =============================
  // FORGET PASSWORD
  // =============================
  forgetPassword: async (email) => {
    try {
      const { data } = await axios.post(
        `${AUTH_ENDPOINT}/users/forget-password`,
        { email }
      );
      if (!data.success) {
        toast.error(data.message || "Something went wrong!");
        return;
      }
      // Success message
      toast.success(data.message || "Password reset link sent!");
      return data;

    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(msg);
    }
  },
  // ==============================
  // change password
  // ==============================
  changePassword: async (payload) => {
    try {
      const { data } = await axios.post(
        `${AUTH_ENDPOINT}/users/change-password-with-token`,
        payload
      );
      if (!data.success) {
        toast.error(data.message || "Something went wrong!");
        return;
      }
      // Success message
      toast.success(data.message || "Password changed successfully!");
      return data;

    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";

      toast.error(msg);
    }
  },
  // ==============================
  // VERIFY OTP
  // ==============================
  verifyOTP: async (payload) => {
    set({ loadingUser: true, userError: null });

    try {
      const { data } = await axios.post(
        `${AUTH_ENDPOINT}/verify-otp`,
        payload
      );

      if (!data.success) {
        set({ loadingUser: false, userError: data.message });
        toast.error(data.message);
        return { success: false, message: data.message };
      }

      toast.success(data.message);

      // Update user data if needed
      if (data.user) {
        set({ user: data.user });
      }

      set({ loadingUser: false, userSuccess: data.message });
      return { success: true, message: data.message };

    } catch (error) {
      console.error('OTP verification error:', error);
      const errMsg = error?.response?.data?.message || "Verification failed";

      set({ loadingUser: false, userError: errMsg });
      toast.error(errMsg);
      return { success: false, message: errMsg };
    }
  },
  // ==============================
  // RESEND OTP
  // ==============================
  resendOTP: async (payload) => {
    set({ loadingUser: true, userError: null });

    try {
      const { data } = await axios.post(
        `${AUTH_ENDPOINT}/resend-otp`,
        payload
      );

      if (!data.success) {
        set({ loadingUser: false, userError: data.message });
        toast.error(data.message);
        return { success: false, message: data.message };
      }

      toast.success("Verification code sent successfully!");
      set({ loadingUser: false, userSuccess: data.message });
      return { success: true, message: data.message };

    } catch (error) {
      console.error('Resend OTP error:', error);
      const errMsg = error?.response?.data?.message || "Failed to resend code";

      set({ loadingUser: false, userError: errMsg });
      toast.error(errMsg);
      return { success: false, message: errMsg };
    }
  },

}));
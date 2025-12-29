import { create } from "zustand";
import axios from "axios";
import { toast } from "react-toastify";
import api from "../lib/axios";

axios.defaults.withCredentials = true;



const initialState = {
  user: null,
  totalUsers: [],
  authenticated: false,
  loadingUser: false,
  checkingAuth: true,
  userError: null,
  userSuccess: null,
};

export const useAuthStore = create((set, get) => ({
  ...initialState,

  // =========================================
  // LOGIN
  // =========================================
  loginUser: async (payload) => {
    set({ loadingUser: true, userError: null });

    try {
      const { data } = await api.post("/user-login", payload);

      if (!data.success) {
        toast.error(data.message);
        set({ loadingUser: false, userError: data.message });
        return { success: false };
      }

      toast.success(data.message);

      set({
        loadingUser: false,
        user: data.user,
      });
      const { user } = get()
      if (user && !user.is_verified) {
        toast.info("Your account is not verified, pls verify your account");
      }
      return {
        success: true,
        route: data.user.role === "admin" ? "/admin/dashboard" : "/dashboard",
      };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Network error";
      toast.error(errMsg);
      set({ loadingUser: false, userError: errMsg });
      return { success: false };
    }
  },

  // =========================================
  // VERIFY OTP
  // =========================================

  register: async (payload) => {
    set({ loadingUser: true, userError: null });

    try {
      const { data } = await api.post("/create-account", payload);

      if (!data.success) {
        toast.error(data.message);
        set({ loadingUser: false, userError: data.message });
        return { success: false };
      }

      toast.success(data.message);

      set({
        loadingUser: false,
        authenticated: true,
      });

      return {
        success: true,
        message: data.message
      };
    } catch (error) {
      const errMsg = error.response?.data?.message || "Network error";
      toast.error(errMsg);
      set({ loadingUser: false, userError: errMsg });
      return { success: false };
    }
  },
  // =========================================
  // VERIFY OTP
  // =========================================
  verifyOTP: async (payload) => {
    set({ loadingUser: true, userError: null, userSuccess: null })
    try {
      const { data } = await api.post("/user-verification", payload)
      if (!data.success) {
        toast.error(data.message)
        return {
          success: false,
          message: data.message
        }
      }
      toast.success(data.message)
      set({ loadingUser: false, userSuccess: data.message });

      return {
        success: true,
        message: data.message
      }
    } catch (error) {
      const errMsg = error.response?.data?.message || "Network error";
      toast.error(errMsg);
      set({ loadingUser: false, userError: errMsg });
      return { success: false };
    }
  },

  // =========================================
  // RESEND OTP
  // =========================================
  resendOTP: async (payload) => {
    set({ loadingUser: true, userError: null, userSuccess: null })
    try {
      const { data } = await api.post('/users/resend-otp', payload);
      if (!data.success) {
        toast.error(data.message)
        set({ loadingUser: false, userError: data.message, userSuccess: null })
        return {
          success: false,
          message: data.message
        }
      }
      toast.success(data.message)
      set({ loadingUser: false, userError: null, userSuccess: data.message })
      return { success: true, message: data.message }
    } catch (error) {
      const errMsg = error?.response?.data?.message
      toast.error(errMsg)
      set({ loadingUser: false, userError: errMsg, userSuccess: null })
    }
  },

  // =========================================
  // CHECK AUTH
  // =========================================
  checkAuth: async () => {
    set({ checkingAuth: true });

    try {
      const { data } = await api.get("/users/get-authenticated-user");

      if (data.success) {
        set({
          user: data.user,
          authenticated: true,
          checkingAuth: false,
        });

        return { success: true };
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        set({
          user: null,
          loadingUser: false,
          checkingAuth: false,
        })
      }
      // interceptor will handle logout if needed

      return { success: false };
    } finally {
      set({ checkingAuth: false, loadingUser: false });
    }
  },
  requestAccountVerification: async (payload) => {
    set({ loadingUser: true, userError: null, userSuccess: null })
    try {
      const { data } = await api.post("/users/request-account-verification", payload);
      if (!data.success) {
        toast.error(data.message);
        return {
          success: false,
          message: data.message
        }
      }
      toast.success(data.message)
      return {
        success: true,
        message: data.message
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message
      toast.error(errMsg)
      return {
        success: false,
        message: errMsg
      }
    }
  },

  logoutUser: async (manual = true) => {
    try {
      await api.post("/users/logout");
    } catch (e) {
      return
     }

    set({
      ...initialState,
      checkingAuth: false,
    });

    if (manual) toast.success("Logged out successfully.");
  },

  // =========================================
  // FORGET PASSWORD
  // =========================================
  forgetPassword: async (email) => {
    try {
      const { data } = await api.post("/users/forget-password", { email });

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      return data;

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    }
  },

  // =========================================
  // CHANGE PASSWORD WITH TOKEN
  // =========================================
  changePassword: async (payload) => {
    try {
      const { data } = await api.post("/users/change-password-with-token", payload);

      if (!data.success) {
        toast.error(data.message);
        return;
      }

      toast.success(data.message);
      return data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Something went wrong."
      );
    }
  },

  // =========================================
  // ADMIN - GET TOTAL USERS
  // =========================================

}));

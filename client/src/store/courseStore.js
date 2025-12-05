import { create } from 'zustand'
import { toast } from 'react-toastify'
import api from '../lib/axios';


const initialState = {
  courses: [],
  loadingCourses: false,
  courseError: null,
  courseSuccess: null,
}

const SERVER_ENDPOINT = `/course`

export const useCourseStore = create((set, get) => ({
  ...initialState,

  // ============================================================
  // CREATE COURSE
  // ============================================================
  addCourse: async (payload) => {
    set({ loadingCourses: true, courseError: null, courseSuccess: null });

    try {
      const { data } = await api.post(`${SERVER_ENDPOINT}/create-course`, payload);

      if (!data.success) {
        set({ loadingCourses: false, courseError: data.message });
        toast.error(data.message);
        return { success: false, message: data.message };
      }

      toast.success(data.message);
      set({ loadingCourses: false, courseSuccess: data.message });
      const { getAllCourses } = get();
      await getAllCourses(true)
      return { success: true, data: data.data };
    } catch (error) {
      const msg = error?.response?.data?.message || "Network error";
      toast.error(msg);
      set({ loadingCourses: false, courseError: msg });
      return { success: false, message: msg };
    }
  },

  // ============================================================
  // GET ALL COURSES
  // ============================================================
  getAllCourses: async (force = false)     => {
    const { courses } = get()
    if (courses.length > 0 && !force) return
    set({ loadingCourses: true, courseError: null, courseSuccess: null });

    try {
      const { data } = await api.get(`${SERVER_ENDPOINT}/get-all-course`);

      if (!data.success) {
        set({ loadingCourses: false, courseError: data.message });
        toast.error(data.message);
        return { success: false, message: data.message };
      }

      set({
        courses: data.courses,
        loadingCourses: false,
        courseSuccess: data.message
      });

      return { success: true, message: data.message };
    } catch (error) {
      const msg = error?.response?.data?.message || "Network error";
      toast.error(msg);

      set({ loadingCourses: false, courseError: msg });
      return { success: false, message: msg };
    }
  },

  // ============================================================
  // GET SINGLE COURSE
  // ============================================================
  getCourse: async (course_id) => {
    try {
      const { data } = await api.get(`${SERVER_ENDPOINT}/get-course/${course_id}`);

      if (!data.success) {
        toast.error(data.message);
        return { success: false, message: data.message };
      }

      return { success: true, data: data.course };
    } catch (error) {
      const msg = error?.response?.data?.message || "Network error";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },
  // ============================================================
  // UPDATE COURSE
  // ============================================================
  updateCourse: async (course_id, payload) => {
    set({ loadingCourses: true, courseError: null, courseSuccess: null });

    try {
      const { data } = await api.put(`${SERVER_ENDPOINT}/update-course/${course_id}`, payload);

      if (!data.success) {
        set({ loadingCourses: false, courseError: data.message });
        toast.error(data.message);
        return { success: false, message: data.message };
      }

      toast.success(data.message);
      set({ loadingCourses: false, courseSuccess: data.message });
      const { getAllCourses } = get();
      await getAllCourses(true)


      return { success: true, data: data.course };
    } catch (error) {
      const msg = error?.response?.data?.message || "Network error";
      toast.error(msg);
      set({ loadingCourses: false, courseError: msg });
      return { success: false, message: msg };
    }
  },
  // ============================================================
  // DELETE COURSE
  // ============================================================
  deleteCourse: async (course_id) => {
    try {
      const { data } = await api.delete(`${SERVER_ENDPOINT}/delete-course/${course_id}`);

      if (!data.success) {
        toast.error(data.message);
        return { success: false, message: data.message };
      }

      toast.success(data.message);

      const { getAllCourses } = get();
      await getAllCourses(true)

      return { success: true, message: data.message };
    } catch (error) {
      const msg = error?.response?.data?.message || "Network error";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

}));

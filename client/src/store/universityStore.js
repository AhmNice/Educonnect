import { create } from 'zustand'
import { toast } from 'react-toastify'
import api from '../lib/axios';
const initialState = {
  universities: [],
  loadingUniversity: false,
  universityError: null,
  universitySuccess: null,
}

const SERVER_ENDPOINT = `/university`

export const useUniversityStore = create((set, get) => ({
  ...initialState,

  // ============================================================
  // GET ALL UNIVERSITIES
  // ============================================================
  getAllUniversities: async (force = false) => {
    const { universities } = get();

    // Cached result: don't refetch unless forced
    if (universities.length > 0 && !force) return;

    set({
      loadingUniversity: true,
      universityError: null,
      universitySuccess: null,
    });

    try {
      const { data } = await api.get(
        `${SERVER_ENDPOINT}/get-all-universities`
      );

      if (!data.success) {
        set({
          loadingUniversity: false,
          universityError: data.message,
        });
        toast.error(data.message);
        return { success: false, message: data.message };
      }

      set({
        universities: data.universities,
        loadingUniversity: false,
        universitySuccess: data.message,
      });

      return {
        success: true,
        message: data.message,
        universities: data.universities,
      };
    } catch (error) {
      const msg =
        error?.response?.data?.message || "Failed to fetch universities";

      toast.error(msg);

      set({
        loadingUniversity: false,
        universityError: msg,
      });

      return { success: false, message: msg };
    }
  },

  // ============================================================
  // FORCE REFRESH
  // ============================================================
  refreshUniversities: async () => {
    return await get().getAllUniversities(true);
  },
}));

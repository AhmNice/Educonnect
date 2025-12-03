import { create } from "zustand";
import { toast } from "react-toastify";
import api from "../lib/axios";


const initialState = {
  stats: [],
  platformMetrics:{},
  loadingStats: false,
  statsError: null,
};

const SERVER_ENDPOINT = `/stats`;

export const useStatsStore = create((set, get) => ({
  ...initialState,

  fetchStats: async (force = false) => {
    const { stats } = get();

    // Use cached stats unless force refresh
    if (stats.length > 0 && !force) return;

    set({ loadingStats: true, statsError: null });

    try {
      const { data } = await api.get(SERVER_ENDPOINT);

      if (!data.success) {
        const msg = data.message || "Failed to fetch stats";
        set({ statsError: msg });
        toast.error(msg);

        return { success: false, message: msg };
      }

      set({
        stats: data.stats,
        statsError: null,
      });

      return {
        success: true,
        stats: data.stats,
        message: data.message,
      };
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        "Error occurred while connecting to server";

      set({ statsError: msg });
      toast.error(msg);

      return { success: false, message: msg };
    } finally {
      set({ loadingStats: false });
    }
  },
   fetch_platform_metrics: async () => {
    set({ loadingUser: true, userError: null });
    try {
      const { data } = await api.get("/stats/admin/platform-metrics")
      if (!data.success) {
        toast.error(data.message)
        set({ loadingUser: false, userError: data.message })
        return
      }
      set({ platformMetrics: data.metrics, loadingUser: false });
    } catch (error) {
      const errMsg = error.response?.data?.message || "Network error";
      toast.error(errMsg);
      set({ loadingUser: false, userError: errMsg });
      return
    }
  },
}));

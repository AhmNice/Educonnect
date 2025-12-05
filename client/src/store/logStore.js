import { create } from "zustand";
import api from "../lib/axios";
import { toast } from "react-toastify";
const initialState = {
  recentActivity: [],
  userActivity: [],
  myActivity: [],
  loadingLog: false,
  logError: null,
  logSuccess: null
}
const END_POINT = '/log'
export const useActivityStore = create((set, get) => ({
  ...initialState,
  fetchLog: async () => {
    set({ loadingLog: true, logError: null, logSuccess: null })
    try {
      const { data } = await api.get(`${END_POINT}/get-recent-log`);
      if (!data.success) {
        set({ loadingLog: false, logError: data.message, logSuccess: null })
        return
      }
      set({ loadingLog: false, recentActivity: data.logs, logSuccess: data.message, logError: null })

      return
    } catch (error) {
      const errMsg = error?.response?.data?.message || error.message
      console.log(errMsg)
      toast.error(errMsg)
      set({ loadingLog: false, logSuccess: null, logError: errMsg })
    }
  },
  fetch_user_log: async (user_id) => {
    set({ loadingLog: true, logError: null, logSuccess: null })
    try {
      const { data } = await api.get(`${END_POINT}/get-user-log/${user_id}`)
      if (!data.success) {
        set({ loadingLog: false, logError: data.message, logSuccess: null })
        return
      }
      set({ loadingLog: false, userActivity: data.logs, logError: null, logSuccess: data.message })
      return
    } catch (error) {
      const errMsg = error?.response?.data?.message || error.message
      console.log(errMsg)
      toast.error(errMsg)
      set({ loadingLog: false, logSuccess: null, logError: errMsg })
    }
  },
  fetch_my_log: async () => {
    set({ loadingLog: true, logError: null, logSuccess: null })
    try {
      const { data } = await api.get(`${END_POINT}/get-user-log`)
      if (!data.success) {
        set({ loadingLog: false, logError: data.message, logSuccess: null })
        return
      }
      set({ loadingLog: false, myActivity: data.logs, logError: null, logSuccess: data.message })
      return
    } catch (error) {
      const errMsg = error?.response?.data?.message || error.message
      console.log(errMsg)
      toast.error(errMsg)
      set({ loadingLog: false, logSuccess: null, logError: errMsg })
    }
  }
}))

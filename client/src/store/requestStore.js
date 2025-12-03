import { create } from "zustand";
import api from "../lib/axios";
import { toast } from "react-toastify";
const initialState = {
  allGroupRequests: [],
  loadingRequest: false,
  requestError: null,
  requestSuccess: null,
}
export const useRequestStore = create((set, get) => ({
  ...initialState,
  fetchAllGroupRequest: async (group_id) => {
    set({ loadingRequest: true, requestError: null, requestSuccess: null })
    try {
      const { data } = await api.get(`/request/request-list/${group_id}`)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingRequest: false, requestError: data.message || 'error', requestSuccess: null })
        return {
          success: false,
          message: data.message || "success"
        }
      }
      set({
        loadingRequest: false,
        requestError: null,
        requestSuccess: data.message || "success",
        allGroupRequests: data.requests
      })
      return { success: true }
    } catch (error) {
      const errMsg = error?.response?.data?.message
      toast.error(errMsg)
      return { success: false, message: errMsg }
    } finally {
      set({ loadingRequest: false })
    }
  },
  sendGroupRequest: async (payload) => {
    set({ loadingRequest: true, requestError: null, requestSuccess: null })
    try {
      const { data } = await api.post("/request/request-to-join", payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingRequest: false, requestSuccess: null, requestError: data.message })
        return { success: false, message: data.message }
      }
      toast.success(data.message)
      set({ loadingRequest: false, requestSuccess: data.message, requestError: null })
      const { fetchAllGroupRequest } = get();

      return { success: true, message: data.message }
    } catch (error) {
      const errMsg = error?.response?.data?.message
      toast.error(errMsg)
      return { success: false, message: errMsg }
    } finally {
      set({ loadingRequest: false })
    }
  },
  approveGroupRequest: async (payload) => {
    set({ loadingRequest: true, requestError: null, requestSuccess: null })
    try {
      const { data } = await api.patch("/request/approve-group-request", payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingRequest: false, requestError: data.message, requestSuccess: null })
        return { success: false, message: data.message }
      }
      set({ loadingRequest: false, requestError: null, requestSuccess: data.message })
      toast.success(data.message)
      const { fetchAllGroupRequest } = get()

      return {
        success: true,
        message: data.message
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message
      toast.error(errMsg)
      return { success: false, message: errMsg }
    } finally {
      set({ loadingRequest: false })
    }
  },
  approveAllGroupRequest: async (payload) => {
    set({ loadingRequest: true, requestSuccess: null, requestError: null })
    try {
      const { data } = await api.patch("/request/bulk-approve", payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingRequest: false, requestError: data.message, requestSuccess: null })
        return { success: false, message: data.message }
      }
      const { fetchAllGroupRequest } = get()
      set({ loadingRequest: false, requestError: null, requestSuccess: data.message })
      toast.success(data.message)
   
      return {
        success: true, message: data.message
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message
      toast.error(errMsg)
      return { success: false, message: errMsg }
    } finally {
      set({ loadingRequest: false })
    }
  },
  rejectGroupRequest: async (payload) => {
    set({ loadingRequest: true, requestSuccess: null, requestError: null })
    try {
      const { data } = await api.patch("/request/decline-group-request", payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingRequest: false, requestError: data.message, requestSuccess: null })
        return {
          success: false,
          message: data.message
        }
      }
      const { fetchAllGroupRequest } = get();
      set({ loadingRequest: false, requestError: null, requestSuccess: data.message })
      toast.success(data.message)

      return {
        success: true,
        message: data.message
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message
      toast.error(errMsg)
      return { success: false, message: errMsg }
    } finally {
      set({ loadingRequest: false })
    }
  },
  rejectAllGroupRequest: async (payload) => {
    set({ loadingRequest: true, requestSuccess: null, requestError: null })
    try {
      const { data } = await api.patch("/request/bulk-reject", payload)
      if (!data.success) {
        toast.error(data.message)
        set({ loadingRequest: false, requestError: data.message, requestSuccess: null })
        return { success: false, message: data.message }
      }
      const { fetchAllGroupRequest } = get()
      set({ loadingRequest: false, requestError: null, requestSuccess: data.message })
      toast.success(data.message)

      return {
        success: true, message: data.message
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message
      toast.error(errMsg)
      return { success: false, message: errMsg }
    } finally {
      set({ loadingRequest: false })
    }
  }
}))
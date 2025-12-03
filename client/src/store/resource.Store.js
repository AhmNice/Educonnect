import { create } from "zustand"
import api from "../lib/axios"
import { toast } from "react-toastify"

const initialState = {
  resources: [],
  singleResource: null,
  loadingResource: false,
  resourcesError: null,
  resourcesSuccess: null,
}

const endpoint = "/resource"

export const useResourceStore = create((set, get) => ({
  ...initialState,

  // ---------------------------------------------------
  // FETCH ALL RESOURCES
  // ---------------------------------------------------
  fetchAllResource: async () => {
    set({ loadingResource: true, resourcesError: null })
    try {
      const { data } = await api.get(`${endpoint}/fetch-all-resources`)

      if (!data.success) {
        set({
          loadingResource: false,
          resourcesError: data.message,
        })
        toast.error(data.message)
        return { success: false }
      }

      set({
        loadingResource: false,
        resources: data.resources,
        resourcesError: null,
      })

      return { success: true }
    } catch (error) {
      console.log(error)
      const errMsg = error?.response?.data?.message || "Unable to load resources"
      toast.error(errMsg)
      set({ resourcesError: errMsg })
      return { success: false }
    } finally {
      set({ loadingResource: false })
    }
  },

  // ---------------------------------------------------
  // ADD A RESOURCE
  // ---------------------------------------------------
  addResource: async (payload) => {
    set({ loadingResource: true, resourcesError: null, resourcesSuccess: null })
    try {
      const { data } = await api.post(`${endpoint}/add-resource`, payload)

      if (!data.success) {
        set({
          loadingResource: false,
          resourcesError: data.message,
          resourcesSuccess: null
        })
        toast.error(data.message)
        return { success: false, message: data.message }
      }

      // ⬇ Add newly created resource to state
      const { fetchAllResource } = get()
      await fetchAllResource()

      toast.success(data.message)
      return { success: true, message: data.message }

    } catch (error) {
      console.log(error)
      const errMsg = error?.response?.data?.message || "Error uploading resource"
      toast.error(errMsg)
      set({ resourcesError: errMsg })
    } finally {
      set({ loadingResource: false })
    }
  },

  // ---------------------------------------------------
  // GET RESOURCE BY ID
  // ---------------------------------------------------
  fetchResourceById: async (id) => {
    set({ loadingResource: true, resourcesError: null, singleResource: null })
    try {
      const { data } = await api.get(`${endpoint}/get-resource/${id}`)

      if (!data.success) {
        set({
          loadingResource: false,
          resourcesError: data.message
        })
        toast.error(data.message)
        return { success: false }
      }

      set({
        loadingResource: false,
        singleResource: data.resource,
        resourcesError: null
      })

      return { success: true, data: data.data }

    } catch (error) {
      const errMsg = error?.response?.data?.message || "Resource not found"
      toast.error(errMsg)
      set({ resourcesError: errMsg })
      return { success: false }
    } finally {
      set({ loadingResource: false })
    }
  },

  // ---------------------------------------------------
  // DELETE RESOURCE
  // ---------------------------------------------------
  deleteResource: async (resourceId, user_id) => {
    set({ loadingResource: true, resourcesError: null })
    try {
      const { data } = await api.delete(`${endpoint}/delete-resource/${resourceId}/${user_id}`)

      if (!data.success) {
        toast.error(data.message)
        set({ resourcesError: data.message })
        return { success: false }
      }

      // ⬇ remove from local store
      set((state) => ({
        resources: state.resources.filter((r) => r.resource_id !== resourceId)
      }))

      toast.success("Resource deleted")
      return { success: true }

    } catch (error) {
      const errMsg = error?.response?.data?.message || "Error deleting resource"
      toast.error(errMsg)
      set({ resourcesError: errMsg })
      return { success: false }

    } finally {
      set({ loadingResource: false })
    }
  },

}))

import { create } from "zustand"
import api from "../lib/axios"
import { toast } from "react-toastify"

const initialState = {
  conversations: [],
  loadingConversation: [],
  conversationError: null,
  conversationSuccess: null
}
export const useConversationStore = create((set, get) => ({
  ...initialState,
  fetchAllConversation: async (user_id) => {
    set({ loadingConversation: true, conversationError: null, conversationSuccess: null })
    try {
      const { data } = await api.get(`/conversation/get-user-conversations/${user_id}`)
      if (!data.success) {
        set({ loadingConversation: false, conversationError: data.message, })
        toast.error(data.message)
      }
      set({
        loadingConversation: false,
        conversations: data.conversations,
        conversationError: null,
        conversationSuccess: null
      })
      return {
        success: true,
        message: data.message
      }
    } catch (error) {
      const errMsg = error?.response?.data?.message
      console.log(errMsg);
      toast.error(errMsg)
    }
  },
}))
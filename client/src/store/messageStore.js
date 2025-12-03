import { create } from 'zustand'
const initialState = {
  messages: [],
  loadingMessages: false,
  messageError: null,
  messageSuccess: null
}

export const useMessageStore = create((set, get) => ({
  ...initialState,
  fetchMessages: async (payload) => {
    set({ loadingMessages: true, messageError: null, messageSuccess: null })
    try {
      
    } catch (error) {

    }
  },
}))
import { create } from "zustand";
import { toast } from "react-toastify";
import api from "../lib/axios";

const initialState = {
  groups: [],
  publicGroups: [],
  loadingGroup: false,
  groupError: null,
  groupSuccess: null,
};

const SERVER_ENDPOINT = `/group`;

export const useGroupStore = create((set, get) => ({
  ...initialState,

  // ✅ Fetch public groups
  getAllGroups: async (force = false) => {
    const { publicGroups } = get();
    if (publicGroups.length > 0 && !force) return;
    set({ loadingGroup: true, groupError: null, groupSuccess: null });
    try {
      const { data } = await api.get(`${SERVER_ENDPOINT}/get-public-groups`);
      if (!data.success) {
        set({ loadingGroup: false, groupError: data.message });
        toast.error(data.message);
        return { success: false, message: data.message };
      }
      set({
        publicGroups: data.groups,
        loadingGroup: false,
        groupSuccess: data.message,
      });
      return { success: true, message: data.message };
    } catch (error) {
      const msg = error?.response?.data?.message || "Network error";
      toast.error(msg);
      set({ loadingGroup: false, groupError: msg });
      return { success: false, message: msg };
    }
  },

  // ✅ Fetch user's own groups
  getUserGroup: async (force = false, user_id) => {
    const { groups } = get();
    if (groups.length > 0 && !force) return;
    set({ loadingGroup: true, groupError: null, groupSuccess: null });
    try {
      const { data } = await api.get(`${SERVER_ENDPOINT}/get-user-groups/${user_id}`);
      if (!data.success) {
        set({ loadingGroup: false, groupError: data.message });
        toast.error(data.message);
        return { success: false, message: data.message };
      }
      set({
        groups: data.groups,
        loadingGroup: false,
        groupSuccess: data.message,
      });
      return { success: true, message: data.message };
    } catch (error) {
      const msg = error?.response?.data?.message || "Network error";
      toast.error(msg);
      set({ loadingGroup: false, groupError: msg });
      return { success: false, message: msg };
    }
  },

  // ✅ Create a new group
  createGroup: async (payload) => {
    set({ loadingGroup: true, groupError: null, groupSuccess: null });
    try {
      const { data } = await api.post(`${SERVER_ENDPOINT}/create-group`, payload);
      if (!data.success) {
        set({ loadingGroup: false, groupError: data.message });
        toast.error(data.message);
        return { success: false, message: data.message };
      }
      set((state) => ({
        groups: [data.group, ...state.groups],
        loadingGroup: false,
        groupSuccess: data.message,
      }));
      toast.success(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      const msg = error?.response?.data?.message || "Network error";
      toast.error(msg);
      set({ loadingGroup: false, groupError: msg });
      return { success: false, message: msg };
    }
  },

  // ✅ Update an existing group
  updateGroup: async (group_id, payload) => {
    set({ loadingGroup: true, groupError: null, groupSuccess: null });
    try {
      const { data } = await api.put(`${SERVER_ENDPOINT}/update/${group_id}`, payload);
      if (!data.success) {
        set({ loadingGroup: false, groupError: data.message });
        toast.error(data.message);
        return { success: false, message: data.message };
      }
      set((state) => ({
        groups: state.groups.map((g) => (g.group_id === group_id ? data.group : g)),
        loadingGroup: false,
        groupSuccess: data.message,
      }));
      toast.success(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      const msg = error?.response?.data?.message || "Network error";
      toast.error(msg);
      set({ loadingGroup: false, groupError: msg });
      return { success: false, message: msg };
    }
  },

  // ✅ Delete a group
  deleteGroup: async (group_id) => {
    set({ loadingGroup: true, groupError: null, groupSuccess: null });
    try {
      const { data } = await api.delete(`${SERVER_ENDPOINT}/delete/${group_id}`);
      if (!data.success) {
        set({ loadingGroup: false, groupError: data.message });
        toast.error(data.message);
        return { success: false, message: data.message };
      }
      set((state) => ({
        groups: state.groups.filter((g) => g.group_id !== group_id),
        publicGroups: state.publicGroups.filter((g) => g.group_id !== group_id),
        loadingGroup: false,
        groupSuccess: data.message,
      }));
      toast.success(data.message);
      return { success: true, message: data.message };
    } catch (error) {
      const msg = error?.response?.data?.message || "Network error";
      toast.error(msg);
      set({ loadingGroup: false, groupError: msg });
      return { success: false, message: msg };
    }
  },
}));

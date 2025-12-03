import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Tag,
  Lock,
  Unlock,
  BookOpen,
  MessageSquare,
  MapPin,
  Loader2,
  MoreVertical,
  UserPlus,
  UserMinus,
  Shield,
} from "lucide-react";
import PageLayout from "../../layout/PageLayout";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/modal/ConfirmModal";

// Study Group Form Component
const StudyGroupForm = ({ group, onCancel, onSuccess }) => {
  const [formData, setFormData] = useState(
    group || {
      group_name: "",
      course: "",
      description: "",
      max_members: 5,
      meeting_schedule: "",
      visibility: "public",
      status: "active",
      tags: [],
    }
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.group_name.trim())
      newErrors.group_name = "Group name is required";
    if (!formData.course.trim()) newErrors.course = "Course name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (formData.max_members < 2)
      newErrors.max_members = "Minimum 2 members required";
    if (formData.max_members > 20)
      newErrors.max_members = "Maximum 20 members allowed";
    if (!formData.meeting_schedule.trim())
      newErrors.meeting_schedule = "Meeting schedule is required";
    return newErrors;
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (index) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      if (group) {
        const { data } = await api.put(
          `/group/update/${group.group_id}`,
          formData
        );

        if (!data.success) {
          throw new Error(data.message || "Failed to update study group");
        }

        toast.success("Study group updated successfully");
      } else {
        const { data } = await api.post("/group/create-group", formData);

        if (!data.success) {
          throw new Error(data.message || "Failed to create study group");
        }

        toast.success("Study group created successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving study group:", error);
      toast.error(
        error.response?.data?.message || error.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {group ? "Edit Study Group" : "Create New Study Group"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Group Name *
              </label>
              <input
                type="text"
                value={formData.group_name}
                onChange={(e) => {
                  setFormData({ ...formData, group_name: e.target.value });
                  if (errors.group_name)
                    setErrors({ ...errors, group_name: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.group_name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Study Group Name"
                disabled={loading}
              />
              {errors.group_name && (
                <p className="text-red-500 text-sm mt-1">{errors.group_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course *
              </label>
              <input
                type="text"
                value={formData.course}
                onChange={(e) => {
                  setFormData({ ...formData, course: e.target.value });
                  if (errors.course)
                    setErrors({ ...errors, course: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.course ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Course Name"
                disabled={loading}
              />
              {errors.course && (
                <p className="text-red-500 text-sm mt-1">{errors.course}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => {
                setFormData({ ...formData, description: e.target.value });
                if (errors.description)
                  setErrors({ ...errors, description: undefined });
              }}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Describe the purpose and goals of this study group..."
              disabled={loading}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Members *
              </label>
              <input
                type="number"
                min="2"
                max="20"
                value={formData.max_members}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    max_members: parseInt(e.target.value) || 5,
                  });
                  if (errors.max_members)
                    setErrors({ ...errors, max_members: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.max_members ? "border-red-500" : "border-gray-300"
                }`}
                disabled={loading}
              />
              {errors.max_members && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.max_members}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Meeting Schedule *
              </label>
              <input
                type="text"
                value={formData.meeting_schedule}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    meeting_schedule: e.target.value,
                  });
                  if (errors.meeting_schedule)
                    setErrors({ ...errors, meeting_schedule: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.meeting_schedule ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="e.g., Monday 2pm, Wednesday 4pm"
                disabled={loading}
              />
              {errors.meeting_schedule && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.meeting_schedule}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visibility
              </label>
              <select
                value={formData.visibility}
                onChange={(e) =>
                  setFormData({ ...formData, visibility: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={loading}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="full">Full</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex space-x-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddTag())
                }
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a tag (press Enter)"
                disabled={loading}
              />
              <button
                type="button"
                onClick={handleAddTag}
                disabled={loading}
                className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors disabled:opacity-50"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(index)}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              disabled={loading}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {group ? "Updating..." : "Creating..."}
                </>
              ) : group ? (
                "Update Group"
              ) : (
                "Create Group"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Study Group Card Component
const StudyGroupCard = React.memo(({ group, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "full":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getVisibilityColor = (visibility) => {
    switch (visibility?.toLowerCase()) {
      case "public":
        return "bg-blue-100 text-blue-800";
      case "private":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {group.group_name}
              </h3>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                  group.status
                )}`}
              >
                {group.status}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <BookOpen className="w-4 h-4" />
              <span className="truncate">{group.course}</span>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onView(group)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              aria-label="View group details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(group)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              aria-label="Edit group"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(group)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label="Delete group"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {group.description}
        </p>

        {/* Tags */}
        {group.tags && group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {group.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Users className="w-4 h-4 text-gray-500" />
              <div className="text-lg font-bold text-gray-900">
                {group.member_count || 0}
              </div>
            </div>
            <div className="text-xs text-gray-500">Members</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              {group.max_members || 5}
            </div>
            <div className="text-xs text-gray-500">Max</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-gray-900">
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${getVisibilityColor(
                  group.visibility
                )}`}
              >
                {group.visibility}
              </span>
            </div>
            <div className="text-xs text-gray-500">Visibility</div>
          </div>
        </div>

        {/* Meeting Schedule */}
        <div className="flex items-center text-sm text-gray-500 mb-4">
          <Clock className="w-4 h-4 mr-2" />
          <span>{group.meeting_schedule || "No schedule set"}</span>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            Created {formatDate(group.created_at)}
          </div>
          <div className="text-xs text-gray-500">
            by {group.creator?.full_name || "Unknown"}
          </div>
        </div>
      </div>
    </div>
  );
});

StudyGroupCard.displayName = "StudyGroupCard";

// Study Group Table Row Component
const StudyGroupRow = React.memo(
  ({ group, selected, onSelect, onEdit, onDelete, onView }) => {
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case "active":
          return "bg-green-100 text-green-800";
        case "inactive":
          return "bg-gray-100 text-gray-800";
        case "full":
          return "bg-red-100 text-red-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    const getVisibilityColor = (visibility) => {
      switch (visibility?.toLowerCase()) {
        case "public":
          return "bg-blue-100 text-blue-800";
        case "private":
          return "bg-purple-100 text-purple-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <tr
        className={`border-b border-gray-200 hover:bg-gray-50 ${
          selected ? "bg-blue-50" : ""
        }`}
      >
        <td className="px-6 py-4 whitespace-nowrap">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onSelect(group.group_id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={`Select ${group.group_name}`}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {group.group_name}
              </div>
              <div className="text-sm text-gray-500">{group.course}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col space-y-1">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-900">
                {group.member_count || 0}/{group.max_members || 5}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              {group.members?.length || 0} member(s)
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex flex-col space-y-1">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                group.status
              )}`}
            >
              {group.status}
            </span>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getVisibilityColor(
                group.visibility
              )}`}
            >
              {group.visibility}
            </span>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-400" />
            {group.meeting_schedule || "No schedule"}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(group.created_at)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => onView(group)}
              className="text-blue-600 hover:text-blue-900 transition-colors"
              aria-label="View group details"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(group)}
              className="text-green-600 hover:text-green-900 transition-colors"
              aria-label="Edit group"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(group)}
              className="text-red-600 hover:text-red-900 transition-colors"
              aria-label="Delete group"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

StudyGroupRow.displayName = "StudyGroupRow";

const StudyGroupsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGroups, setSelectedGroups] = useState([]);
  const [activeView, setActiveView] = useState("list");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [deletingGroup, setDeletingGroup] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [stats, setStats] = useState({
    totalGroups: 0,
    activeGroups: 0,
    totalMembers: 0,
    averageMembers: 0,
  });

  const [filters, setFilters] = useState({
    status: "all",
    visibility: "all",
  });

  const fetchStudyGroups = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/group/get-public-groups");
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch study groups");
      }
      setGroups(data.groups || []);

      // Calculate stats
      const total = data.groups.length;
      const active = data.groups.filter((g) => g.status === "active").length;
      const totalMembers = data.groups.reduce(
        (sum, g) => sum + parseInt(g.member_count || 0),
        0
      );
      const averageMembers = total > 0 ? (totalMembers / total).toFixed(1) : 0;

      setStats({
        totalGroups: total,
        activeGroups: active,
        totalMembers: totalMembers,
        averageMembers: parseFloat(averageMembers),
      });
    } catch (error) {
      console.error("Error fetching study groups:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load study groups"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudyGroups();
  }, [fetchStudyGroups]);

  const handleDeleteGroup = async (groupId) => {
    if (!groupId) return;

    try {
      const { data } = await api.delete(`/study-groups/delete/${groupId}`);
      if (!data.success) {
        throw new Error(data.message || "Failed to delete study group");
      }

      toast.success("Study group deleted successfully");
      fetchStudyGroups();
      // Remove from selected if it was selected
      setSelectedGroups((prev) => prev.filter((id) => id !== groupId));
    } catch (error) {
      console.error("Error deleting study group:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete study group"
      );
    } finally {
      setOpenConfirmModal(false);
      setDeletingGroup(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingGroup) {
      handleDeleteGroup(deletingGroup.group_id);
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedGroups.length === 0) {
      toast.error("No study groups selected for bulk action");
      return;
    }

    setBulkActionLoading(true);
    try {
      if (action === "activate") {
        await Promise.all(
          selectedGroups.map((groupId) =>
            api.put(`/group/update/${groupId}`, { status: "active" })
          )
        );
        toast.success("Study groups activated successfully");
      } else if (action === "deactivate") {
        await Promise.all(
          selectedGroups.map((groupId) =>
            api.put(`/group/update/${groupId}`, { status: "inactive" })
          )
        );
        toast.success("Study groups deactivated successfully");
      }

      fetchStudyGroups();
      setSelectedGroups([]);
    } catch (error) {
      console.error("Error in bulk action:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to perform bulk action"
      );
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedGroups(filteredGroups.map((group) => group.group_id));
    } else {
      setSelectedGroups([]);
    }
  };

  const handleSelect = (groupId) => {
    setSelectedGroups((prev) =>
      prev.includes(groupId)
        ? prev.filter((id) => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleModalSuccess = () => {
    fetchStudyGroups();
    setIsAddModalOpen(false);
    setEditingGroup(null);
  };

  const handleModalCancel = () => {
    setIsAddModalOpen(false);
    setEditingGroup(null);
  };

  const handleViewGroup = (group) => {
    // Navigate to group detail page
    toast.info(`Viewing study group: ${group.group_name}`);
    // You can implement navigation here
    // navigate(`/admin/study-groups/${group.group_id}`);
  };

  // Filter groups
  const filteredGroups = groups.filter((group) => {
    if (!group) return false;

    const matchesSearch =
      (group.group_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (group.course || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (group.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (group.meeting_schedule || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      filters.status === "all" || group.status === filters.status;

    const matchesVisibility =
      filters.visibility === "all" || group.visibility === filters.visibility;

    return matchesSearch && matchesStatus && matchesVisibility;
  });

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Study Group Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage and organize study groups
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Group</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-indigo-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalGroups}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Groups</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.activeGroups}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Active Groups</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalMembers}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Members</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.averageMembers}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Avg. Members per Group</p>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search groups by name, course, description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filters.status}
                  onChange={(e) =>
                    setFilters({ ...filters, status: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="full">Full</option>
                </select>

                <select
                  value={filters.visibility}
                  onChange={(e) =>
                    setFilters({ ...filters, visibility: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Visibility</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>

            {/* View Toggle and Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4">
                {/* View Toggle */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveView("list")}
                    className={`p-2 rounded-md transition-colors ${
                      activeView === "list"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    List
                  </button>
                  <button
                    onClick={() => setActiveView("grid")}
                    className={`p-2 rounded-md transition-colors ${
                      activeView === "grid"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Grid
                  </button>
                </div>

                {/* Actions */}
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Upload"
                >
                  <Upload className="w-5 h-5" />
                </button>
              </div>

              <div className="text-sm text-gray-500">
                Showing {filteredGroups.length} of {groups.length} groups
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedGroups.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 font-medium">
                    {selectedGroups.length} groups selected
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    disabled={bulkActionLoading}
                    onClick={() => handleBulkAction("activate")}
                    className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bulkActionLoading ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    )}
                    Activate
                  </button>
                  <button
                    disabled={bulkActionLoading}
                    onClick={() => handleBulkAction("deactivate")}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bulkActionLoading ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <XCircle className="w-4 h-4 mr-1" />
                    )}
                    Deactivate
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading && filteredGroups.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">
                Loading study groups...
              </span>
            </div>
          )}

          {/* Content */}
          {!loading || filteredGroups.length > 0 ? (
            <>
              {activeView === "grid" ? (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGroups.map((group) => (
                    <StudyGroupCard
                      key={group.group_id}
                      group={group}
                      onEdit={setEditingGroup}
                      onDelete={(group) => {
                        setDeletingGroup(group);
                        setOpenConfirmModal(true);
                      }}
                      onView={handleViewGroup}
                    />
                  ))}
                </div>
              ) : (
                // Table View
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              onChange={handleSelectAll}
                              checked={
                                filteredGroups.length > 0 &&
                                selectedGroups.length === filteredGroups.length
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              aria-label="Select all groups"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Group
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Members
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status & Visibility
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Meeting Schedule
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredGroups.map((group) => (
                          <StudyGroupRow
                            key={group.group_id}
                            group={group}
                            selected={selectedGroups.includes(group.group_id)}
                            onSelect={handleSelect}
                            onEdit={setEditingGroup}
                            onDelete={(group) => {
                              setDeletingGroup(group);
                              setOpenConfirmModal(true);
                            }}
                            onView={handleViewGroup}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredGroups.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No study groups found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ||
                    filters.status !== "all" ||
                    filters.visibility !== "all"
                      ? "Try adjusting your search or filters"
                      : "Get started by creating your first study group"}
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Create Group
                  </button>
                </div>
              )}
            </>
          ) : null}

          {/* Add/Edit Modal */}
          {(isAddModalOpen || editingGroup) && (
            <StudyGroupForm
              group={editingGroup}
              onCancel={handleModalCancel}
              onSuccess={handleModalSuccess}
            />
          )}

          {/* Confirm Delete Modal */}
          {openConfirmModal && deletingGroup && (
            <ConfirmModal
              title="Delete Study Group"
              message={`Are you sure you want to delete "${deletingGroup.group_name}"? This action cannot be undone. All group data and member associations will be lost.`}
              variant="danger"
              isOpen={openConfirmModal}
              onConfirm={handleConfirmDelete}
              onClose={() => {
                setOpenConfirmModal(false);
                setDeletingGroup(null);
              }}
              confirmText="Delete Group"
              cancelText="Cancel"
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default StudyGroupsPage;

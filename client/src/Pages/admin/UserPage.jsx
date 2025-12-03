import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  Edit,
  Trash2,
  Eye,
  Download,
  Mail,
  User,
  Users,
  Shield,
  BookOpen,
  Building,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical,
  Ban,
  RefreshCw,
  Send,
  Loader2,
} from "lucide-react";
import PageLayout from "../../layout/PageLayout";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";
import { useUniversityStore } from "../../store/universityStore";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../../components/modal/ConfirmModal";

// User Form Component (moved outside to prevent re-renders)
const UserForm = ({ user, onCancel, onSuccess, loggedInUser }) => {
  const [formData, setFormData] = useState(
    user || {
      email: "",
      full_name: "",
      role: "student",
      university_id: "",
      department: "",
      password: "",
      status: "active",
    }
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.full_name.trim())
      newErrors.full_name = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!user && !formData.password)
      newErrors.password = "Password is required for new users";
    return newErrors;
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
      if (user) {
        // Check if any fields actually changed
        const hasChanges =
          formData.email !== user.email ||
          formData.full_name !== user.full_name ||
          formData.role !== user.role ||
          formData.department !== (user.department || "") ||
          formData.status !== (user.status || "active") ||
          formData.university_id !== (user.university_id || "");

        if (!hasChanges) {
          toast.error("No changes detected");
          return;
        }

        const toSubmit = {};
        if (formData.email !== user.email) toSubmit.email = formData.email;
        if (formData.full_name !== user.full_name)
          toSubmit.full_name = formData.full_name;
        if (formData.role !== user.role) toSubmit.role = formData.role;
        if (formData.department !== (user.department || ""))
          toSubmit.department = formData.department;
        if (formData.status !== (user.status || "active"))
          toSubmit.status = formData.status;
        if (formData.university_id !== (user.university_id || ""))
          toSubmit.university_id = formData.university_id;

        const { data } = await api.patch(
          `/users/admin-update-user/${user.user_id}/${loggedInUser.user_id}`,
          toSubmit
        );

        if (!data.success) {
          throw new Error(data.message || "Failed to update user");
        }

        toast.success(data.message);
      } else {
        const { data } = await api.post(`/users/admin/create-user`, formData);

        if (!data.success) {
          throw new Error(data.message || "Failed to create user");
        }

        toast.success(data.message);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error(
        error.response?.data?.message || error.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {user ? "Edit User" : "Add New User"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.full_name}
              onChange={(e) => {
                setFormData({ ...formData, full_name: e.target.value });
                if (errors.full_name)
                  setErrors({ ...errors, full_name: undefined });
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.full_name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter full name"
              disabled={loading}
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="user@university.edu"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <select
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="student">Student</option>
              <option value="tutor">Tutor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <input
              type="text"
              value={formData.department || ""}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Computer Science, Mathematics, etc."
              disabled={loading}
            />
          </div>

          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password *
              </label>
              <input
                type="password"
                value={formData.password || ""}
                onChange={(e) => {
                  setFormData({ ...formData, password: e.target.value });
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="**********"
                disabled={loading}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>
          )}

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
              <option value="suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University
            </label>
            <select
              value={formData.university_id}
              onChange={(e) =>
                setFormData({ ...formData, university_id: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="">Select university</option>
              {window.universities?.map((uni) => (
                <option key={uni.university_id} value={uni.university_id}>
                  {uni.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
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
                  {user ? "Updating..." : "Creating..."}
                </>
              ) : user ? (
                "Update User"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// User Card Component
const UserCard = React.memo(({ user, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "Never";
    try {
      return new Date(dateString).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  if (!user) return null;

  const initials = user.full_name
    ? user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "??";

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-semibold ${
                user.role === "student"
                  ? "bg-blue-500"
                  : user.role === "tutor"
                  ? "bg-green-500"
                  : "bg-purple-500"
              }`}
            >
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 truncate">
                {user.full_name || "Unnamed User"}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {user.email || "No email"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-1">
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user.role === "student"
                  ? "bg-blue-100 text-blue-800"
                  : user.role === "tutor"
                  ? "bg-green-100 text-green-800"
                  : "bg-purple-100 text-purple-800"
              }`}
            >
              {user.role || "unknown"}
            </span>
            <span
              className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                user.status === "active"
                  ? "bg-green-100 text-green-800"
                  : user.status === "inactive"
                  ? "bg-gray-100 text-gray-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {user.status || "unknown"}
            </span>
          </div>
        </div>

        {user.university_name && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Building className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{user.university_name}</span>
          </div>
        )}

        {user.department && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <BookOpen className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{user.department}</span>
          </div>
        )}

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-gray-600">
            <Mail className="w-4 h-4 mr-1" />
            {user.email_verified ? "Verified" : "Pending"}
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="w-4 h-4 mr-1" />
            {formatDate(user.created_at)}
          </div>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-b-2xl">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Last login: {formatDateTime(user.last_login)}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(user)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-colors"
              aria-label="Edit user"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(user)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
              aria-label="Delete user"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

UserCard.displayName = "UserCard";

// User Table Row Component
const UserRow = React.memo(
  ({ user, selected, onSelect, onEdit, onDelete, navigate }) => {
    const formatDate = (dateString) => {
      if (!dateString) return "N/A";
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      } catch (error) {
        return "Invalid date";
      }
    };

    if (!user) return null;

    const initials = user.full_name
      ? user.full_name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "??";

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
            onChange={() => user.user_id && onSelect(user.user_id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={`Select ${user.full_name}`}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-semibold ${
                user.role === "student"
                  ? "bg-blue-500"
                  : user.role === "tutor"
                  ? "bg-green-500"
                  : "bg-purple-500"
              }`}
            >
              {initials}
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {user.full_name || "Unnamed User"}
              </div>
              <div className="text-sm text-gray-500">
                {user.email || "No email"}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.role === "student"
                ? "bg-blue-100 text-blue-800"
                : user.role === "tutor"
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {user.role || "unknown"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {user.university_name || "N/A"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {user.department || "N/A"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <span
            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
              user.status === "active"
                ? "bg-green-100 text-green-800"
                : user.status === "inactive"
                ? "bg-gray-100 text-gray-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {user.status || "unknown"}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(user.created_at)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() =>
                navigate(`/admin/users/user-profile/${user.user_id}`)
              }
              className="text-blue-600 hover:text-blue-900 transition-colors"
              aria-label="View user profile"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(user)}
              className="text-green-600 hover:text-green-900 transition-colors"
              aria-label="Edit user"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(user)}
              className="text-red-600 hover:text-red-900 transition-colors"
              aria-label="Delete user"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

UserRow.displayName = "UserRow";

const UsersPage_admin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [activeView, setActiveView] = useState("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [deletingUser, setDeletingUser] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const { user: loggedInUser } = useAuthStore();
  const { universities, getAllUniversities } = useUniversityStore();
  const navigate = useNavigate();

  // Store universities globally for form access
  useEffect(() => {
    if (universities.length > 0) {
      window.universities = universities;
    }
  }, [universities]);

  const fetch_user_list = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get("/stats/admin/user-list");
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch users");
      }
      setUsers(data.users || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(
        error.response?.data?.message || error.message || "Failed to load users"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetch_user_list();
  }, []);
  useEffect(() => {
    document.title = "User Management - EduConnect Admin";

    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 768;
      setActiveView(isMobile ? "grid" : "list");
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        await getAllUniversities(true);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };
    if (universities.length === 0) fetchUniversities();
  }, []);

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) {
      toast.error("No users selected for bulk action");
      return;
    }

    setBulkActionLoading(true);
    try {
      if (action === "suspend" || action === "activate") {
        const formData = {
          status: action === "suspend" ? "suspended" : "active",
          selected_users: selectedUsers,
        };

        const { data } = await api.put(
          "/users/admin/update-account-status",
          formData
        );

        if (!data.success) {
          throw new Error(data.message || "Failed to update users");
        }

        toast.success(
          `Users ${
            action === "suspend" ? "suspended" : "activated"
          } successfully`
        );
        fetch_user_list();
        setSelectedUsers([]);
      }
      if (action === "send_mail") {
        toast.info("Send email functionality not implemented yet");
      }
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

  const handleDeleteAccount = async (userId) => {
    if (!userId) return;

    try {
      const { data } = await api.delete(`/users/delete-user/${userId}`);
      if (!data.success) {
        throw new Error(data.message || "Failed to delete user");
      }

      toast.success(data.message);
      fetch_user_list();
      // Remove from selected if it was selected
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete user"
      );
    } finally {
      setOpenConfirmModal(false);
      setDeletingUser(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingUser) {
      handleDeleteAccount(deletingUser.user_id);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUsers(filteredUsers.map((user) => user.user_id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleSelect = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleModalSuccess = () => {
    fetch_user_list();
    setIsAddModalOpen(false);
    setEditingUser(null);
  };

  const handleModalCancel = () => {
    setIsAddModalOpen(false);
    setEditingUser(null);
  };

  // Stats with safe access
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((user) => user?.status === "active").length,
    students: users.filter((user) => user?.role === "student").length,
    admins: users.filter((user) => user?.role === "admin").length,
    pendingVerification: users.filter((user) => !user?.email_verified).length,
  };

  // Filter users with null checks
  const filteredUsers = users.filter((user) => {
    if (!user) return false;

    const userFullName = user.full_name?.toLowerCase() || "";
    const userEmail = user.email?.toLowerCase() || "";
    const userDepartment = user.department?.toLowerCase() || "";
    const userUniversity = user.university_name?.toLowerCase() || "";

    const matchesSearch =
      userFullName.includes(searchTerm.toLowerCase()) ||
      userEmail.includes(searchTerm.toLowerCase()) ||
      userDepartment.includes(searchTerm.toLowerCase()) ||
      userUniversity.includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Loading state
  if (isLoading && users.length === 0) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading users...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  User Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage students, and administrators
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add User</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalUsers}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Users</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.activeUsers}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Active Users</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.students}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Students</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.admins}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Admins</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.pendingVerification}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Pending Verification</p>
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
                  placeholder="Search users by name, email, department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters and Actions */}
              <div className="flex items-center space-x-4">
                {/* Role Filter */}
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Roles</option>
                  <option value="student">Students</option>
                  <option value="tutor">Tutors</option>
                  <option value="admin">Admins</option>
                </select>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>

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
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedUsers.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-700 font-medium">
                    {selectedUsers.length} users selected
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleBulkAction("send_mail")}
                    disabled={bulkActionLoading}
                    className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bulkActionLoading ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-1" />
                    )}
                    Send Email
                  </button>
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
                    onClick={() => handleBulkAction("suspend")}
                    className="bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {bulkActionLoading ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <Ban className="w-4 h-4 mr-1" />
                    )}
                    Suspend
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Content */}
          {!isLoading || filteredUsers.length > 0 ? (
            <>
              {activeView === "grid" ? (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <UserCard
                      key={user.user_id}
                      user={user}
                      onEdit={setEditingUser}
                      onDelete={(user) => {
                        setDeletingUser(user);
                        setOpenConfirmModal(true);
                      }}
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
                                filteredUsers.length > 0 &&
                                selectedUsers.length === filteredUsers.length
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              aria-label="Select all users"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            University
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Department
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Joined
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <UserRow
                            key={user.user_id}
                            user={user}
                            selected={selectedUsers.includes(user.user_id)}
                            onSelect={handleSelect}
                            onEdit={setEditingUser}
                            onDelete={(user) => {
                              setDeletingUser(user);
                              setOpenConfirmModal(true);
                            }}
                            navigate={navigate}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!isLoading && filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No users found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ||
                    statusFilter !== "all" ||
                    roleFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "Get started by adding your first user"}
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add User
                  </button>
                </div>
              )}
            </>
          ) : null}

          {/* Add/Edit Modal */}
          {(isAddModalOpen || editingUser) && (
            <UserForm
              user={editingUser}
              onCancel={handleModalCancel}
              onSuccess={handleModalSuccess}
              loggedInUser={loggedInUser}
            />
          )}

          {/* Confirm Delete Modal */}
          {openConfirmModal && deletingUser && (
            <ConfirmModal
              title="Delete User"
              message={`Are you sure you want to delete "${deletingUser.full_name}"? This action cannot be undone.`}
              variant="danger"
              isOpen={openConfirmModal}
              onConfirm={handleConfirmDelete}
              onClose={() => {
                setOpenConfirmModal(false);
                setDeletingUser(null);
              }}
              confirmText="Delete"
              cancelText="Cancel"
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default UsersPage_admin;

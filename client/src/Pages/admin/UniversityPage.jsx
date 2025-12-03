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
  Building,
  Mail,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  MoreVertical,
  Users,
  BookOpen,
  Loader2,
} from "lucide-react";
import PageLayout from "../../layout/PageLayout";
import { useUniversityStore } from "../../store/universityStore";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import ConfirmModal from "../../components/modal/ConfirmModal";

const UniversityForm = ({ university, onCancel, onSuccess, updating }) => {
  const [formData, setFormData] = useState(
    university || {
      name: "",
      location: "",
      contact_email: "",
    }
  );

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.contact_email.trim()) newErrors.email = "Email is required";
    if (
      formData.contact_email &&
      !/^\S+@\S+\.\S+$/.test(formData.contact_email)
    ) {
      newErrors.email = "Invalid email format";
    }
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
      if (university) {
        // Check if any fields actually changed
        const hasChanges =
          formData.name !== university.name ||
          formData.location !== university.location ||
          formData.contact_email !== university.contact_email;

        if (!hasChanges) {
          toast.error("No changes detected");
          return;
        }

        const { data } = await api.patch(
          `/university/update/${university.university_id}`,
          formData
        );

        if (!data.success) {
          throw new Error(data.message || "Failed to update university");
        }

        toast.success("University updated successfully");
      } else {
        const { data } = await api.post(
          "/university/create-university",
          formData
        );

        if (!data.success) {
          throw new Error(data.message || "Failed to create university");
        }

        toast.success("University created successfully");
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving university:", error);
      toast.error(
        error.response?.data?.message || error.message || "Operation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {university ? "Edit University" : "Add New University"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              University Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ ...errors, name: undefined });
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter university name"
              disabled={loading}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="City, State, Country"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Email *
            </label>
            <input
              type="email"
              required
              value={formData.contact_email}
              onChange={(e) => {
                setFormData({ ...formData, contact_email: e.target.value });
                if (errors.email) setErrors({ ...errors, email: undefined });
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="admin@university.edu"
              disabled={loading}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
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
                  {university ? "Updating..." : "Creating..."}
                </>
              ) : university ? (
                "Update University"
              ) : (
                "Create University"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const UniversityCard = React.memo(({ university, onEdit, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Building className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0 w-40">
              <h3 className="font-semibold text-gray-900 w-full truncate">
                {university.name}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {university.contact_email}
              </p>
            </div>
          </div>
        </div>

        {university.location && (
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
            <span className="truncate">{university.location}</span>
          </div>
        )}

        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="truncate">{university.contact_email}</span>
        </div>
      </div>

      <div className="p-4 bg-gray-50 rounded-b-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            Added {formatDate(university.created_at)}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(university)}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-colors"
              aria-label="Edit university"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(university)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-lg transition-colors"
              aria-label="Delete university"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

UniversityCard.displayName = "UniversityCard";

const UniversityRow = React.memo(
  ({ university, selected, onSelect, onEdit, onDelete }) => {
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
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
            onChange={() => onSelect(university.university_id)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            aria-label={`Select ${university.name}`}
          />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Building className="w-5 h-5 text-white" />
            </div>
            <div className="ml-4">
              <div className="text-sm font-medium text-gray-900">
                {university.name}
              </div>
              <div className="text-sm text-gray-500">
                {university.contact_email}
              </div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
          {university.location || "Not specified"}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          {formatDate(university.created_at)}
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end space-x-2">
            <button
              onClick={() => onEdit(university)}
              className="text-green-600 hover:text-green-900 transition-colors"
              aria-label="Edit university"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(university)}
              className="text-red-600 hover:text-red-900 transition-colors"
              aria-label="Delete university"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>
    );
  }
);

UniversityRow.displayName = "UniversityRow";

const UniversityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUniversities, setSelectedUniversities] = useState([]);
  const [activeView, setActiveView] = useState("list");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [deletingUniversity, setDeletingUniversity] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const { universities, getAllUniversities } = useUniversityStore();

  // Memoized fetch function
  const fetchUniversities = useCallback(async () => {
    setLoading(true);
    try {
      await getAllUniversities(true);
    } catch (error) {
      console.error("Error fetching universities:", error);
      toast.error("Failed to load universities");
    } finally {
      setLoading(false);
    }
  }, [getAllUniversities]);

  useEffect(() => {
    document.title = "University Management - EduConnect Admin";

    const checkScreenSize = () => {
      const isMobile = window.innerWidth < 768;
      setActiveView(isMobile ? "grid" : "list");
    };
~
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    fetchUniversities();
  }, [fetchUniversities]);

  const handleDelete = async (universityId) => {
    if (!universityId) return;

    try {
      const { data } = await api.delete(`/university/delete/${universityId}`);
      if (data.success) {
        toast.success("University deleted successfully");
        fetchUniversities();
        // Remove from selected if it was selected
        setSelectedUniversities((prev) =>
          prev.filter((id) => id !== universityId)
        );
      } else {
        throw new Error(data.message || "Failed to delete university");
      }
    } catch (error) {
      console.error("Error deleting university:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete university"
      );
    } finally {
      setDeletingUniversity(null);
      setOpenConfirmModal(false);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingUniversity) {
      handleDelete(deletingUniversity.university_id);
    }
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedUniversities(
        filteredUniversities.map((uni) => uni.university_id)
      );
    } else {
      setSelectedUniversities([]);
    }
  };

  const handleSelect = (universityId) => {
    setSelectedUniversities((prev) =>
      prev.includes(universityId)
        ? prev.filter((id) => id !== universityId)
        : [...prev, universityId]
    );
  };

  const handleModalSuccess = () => {
    fetchUniversities();
    setIsAddModalOpen(false);
    setEditingUniversity(null);
  };

  const handleModalCancel = () => {
    setIsAddModalOpen(false);
    setEditingUniversity(null);
  };

  // Stats based on actual data
  const stats = {
    totalUniversities: universities.length,
    recentlyAdded: universities.filter((uni) => {
      const createdDate = new Date(uni.created_at);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return createdDate > thirtyDaysAgo;
    }).length,
  };

  // Filter universities based on search
  const filteredUniversities = universities.filter(
    (uni) =>
      uni.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (uni.location &&
        uni.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
      uni.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 p-2 lg:p-6 pt-2">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  University Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage universities and their information
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add University</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-500">
                  <Building className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.totalUniversities}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Total Universities</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-green-500">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">
                  {stats.recentlyAdded}
                </div>
              </div>
              <p className="text-gray-600 text-sm">Added Last 30 Days</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-purple-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">0</div>
              </div>
              <p className="text-gray-600 text-sm">Active Students</p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-orange-500">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-gray-900">0</div>
              </div>
              <p className="text-gray-600 text-sm">Total Courses</p>
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
                  placeholder="Search universities by name, location, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* View Toggles and Actions */}
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
                  aria-label="Filter"
                >
                  <Filter className="w-5 h-5" />
                </button>
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Download"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && filteredUniversities.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">
                Loading universities...
              </span>
            </div>
          )}

          {/* Content */}
          {!loading || filteredUniversities.length > 0 ? (
            <>
              {activeView === "grid" ? (
                // Grid View
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUniversities.map((university) => (
                    <UniversityCard
                      key={university.university_id}
                      university={university}
                      onEdit={setEditingUniversity}
                      onDelete={() => {
                        setDeletingUniversity(university);
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
                                filteredUniversities.length > 0 &&
                                selectedUniversities.length ===
                                  filteredUniversities.length
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                              aria-label="Select all universities"
                            />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            University
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Created Date
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUniversities.map((university) => (
                          <UniversityRow
                            key={university.university_id}
                            university={university}
                            selected={selectedUniversities.includes(
                              university.university_id
                            )}
                            onSelect={handleSelect}
                            onEdit={setEditingUniversity}
                            onDelete={() => {
                              console.log(university);
                              setDeletingUniversity(university);
                              setOpenConfirmModal(true);
                            }}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!loading && filteredUniversities.length === 0 && (
                <div className="text-center py-12">
                  <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm
                      ? "No universities found"
                      : "No universities yet"}
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm
                      ? "Try adjusting your search terms"
                      : "Get started by adding your first university"}
                  </p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Add University
                  </button>
                </div>
              )}
            </>
          ) : null}

          {/* Add/Edit Modal */}
          {(isAddModalOpen || editingUniversity) && (
            <UniversityForm
              university={editingUniversity}
              onCancel={handleModalCancel}
              onSuccess={handleModalSuccess}
              updating={editingUniversity !== null}
            />
          )}

          {/* Confirm Delete Modal */}
          {openConfirmModal && deletingUniversity && (
            <ConfirmModal
              isOpen={openConfirmModal}
              onClose={() => {
                setOpenConfirmModal(false);
                setDeletingUniversity(null);
              }}
              onConfirm={handleConfirmDelete}
              variant="danger"
              title="Delete University"
              message={`Are you sure you want to delete "${deletingUniversity.name}"? This action cannot be undone.`}
              confirmText="Delete"
              cancelText="Cancel"
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default UniversityPage;

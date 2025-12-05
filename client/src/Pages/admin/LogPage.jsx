import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Download,
  RefreshCw,
  ChevronDown,
  Eye,
  Trash2,
  LogOut,
  LogIn,
  Edit,
  Plus,
  XCircle,
  CheckCircle,
  AlertCircle,
  FileText,
  Users,
  BookOpen,
  MessageSquare,
  Upload,
  MoreVertical,
  Loader2,
  Zap,
  UserCheck,
  UserX,
} from "lucide-react";
import PageLayout from "../../layout/PageLayout";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import ActivityLogCard from "../../components/ActivityLogCard";
import ConfirmModal from "../../components/modal/ConfirmModal";
import { useActivityStore } from "../../store/logStore";

// Activity Detail Modal
const ActivityDetailModal = ({ activity, onClose }) => {
  if (!activity) return null;

  const formatFullDate = (timestamp) => {
    if (!timestamp) return "N/A";
    return new Date(timestamp).toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "login":
        return { icon: LogIn, color: "text-green-500", bg: "bg-green-50" };
      case "logout":
        return { icon: LogOut, color: "text-red-500", bg: "bg-red-50" };
      case "create":
        return { icon: Plus, color: "text-blue-500", bg: "bg-blue-50" };
      case "update":
        return { icon: Edit, color: "text-yellow-500", bg: "bg-yellow-50" };
      case "delete":
        return { icon: Trash2, color: "text-red-500", bg: "bg-red-50" };
      case "view":
        return { icon: Eye, color: "text-indigo-500", bg: "bg-indigo-50" };
      case "download":
        return { icon: Download, color: "text-purple-500", bg: "bg-purple-50" };
      case "upload":
        return { icon: Upload, color: "text-cyan-500", bg: "bg-cyan-50" };
      case "course":
        return { icon: BookOpen, color: "text-orange-500", bg: "bg-orange-50" };
      case "user":
        return { icon: Users, color: "text-pink-500", bg: "bg-pink-50" };
      case "message":
        return {
          icon: MessageSquare,
          color: "text-teal-500",
          bg: "bg-teal-50",
        };
      case "success":
        return {
          icon: CheckCircle,
          color: "text-green-500",
          bg: "bg-green-50",
        };
      case "error":
        return { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" };
      default:
        return { icon: User, color: "text-gray-500", bg: "bg-gray-50" };
    }
  };

  const activityInfo = getActivityIcon(activity.activity_type);
  const ActivityIcon = activityInfo.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Activity Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center space-x-4">
            <div className={`${activityInfo.bg} p-3 rounded-xl`}>
              <ActivityIcon className={`w-6 h-6 ${activityInfo.color}`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {activity.description}
              </h3>
              <p className="text-sm text-gray-500">
                {formatFullDate(activity.timestamp)}
              </p>
            </div>
          </div>

          {/* Activity Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">User</h4>
              <div className="flex items-center">
                <User className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-900">
                  {activity.user || "Unknown"}
                </span>
              </div>
              {activity.user_email && (
                <p className="text-sm text-gray-500 mt-1">
                  {activity.user_email}
                </p>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Activity Type
              </h4>
              <div className="flex items-center">
                <ActivityIcon className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-900 capitalize">
                  {activity.activity_type.replace(/_/g, " ")}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                ID: {activity.activity_id?.slice(-8)}
              </p>
            </div>
          </div>

          {/* Additional Details */}
          {(activity.ip_address ||
            activity.user_agent ||
            activity.location) && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Additional Information
              </h4>
              <div className="space-y-2">
                {activity.ip_address && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-24">IP Address:</span>
                    <span className="text-gray-900 font-mono">
                      {activity.ip_address}
                    </span>
                  </div>
                )}
                {activity.location && (
                  <div className="flex items-center text-sm">
                    <span className="text-gray-600 w-24">Location:</span>
                    <span className="text-gray-900">{activity.location}</span>
                  </div>
                )}
                {activity.user_agent && (
                  <div className="text-sm">
                    <span className="text-gray-600">User Agent:</span>
                    <p className="text-gray-900 text-xs mt-1 break-words">
                      {activity.user_agent}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Extended Details */}
          {activity.details && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Extended Details
              </h4>
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {typeof activity.details === "object"
                  ? JSON.stringify(activity.details, null, 2)
                  : activity.details}
              </pre>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recent Activity Badge Component
const RecentActivityBadge = ({ activity }) => {
  const getActivityColor = (type) => {
    switch (type) {
      case "login":
        return "bg-green-100 text-green-800 border-green-200";
      case "logout":
        return "bg-red-100 text-red-800 border-red-200";
      case "create":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "update":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "delete":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full border ${getActivityColor(
        activity.activity_type
      )}`}
    >
      <span className="text-xs font-medium">
        {activity.activity_type?.toUpperCase()}
      </span>
      <span className="ml-2 text-xs opacity-75">
        {formatTime(activity.timestamp)}
      </span>
    </div>
  );
};

// User Activity Summary Component
const UserActivitySummary = ({ recentActivity }) => {
  if (!recentActivity || recentActivity.length === 0) return null;

  // Count activities by user
  const userActivityCount = {};
  recentActivity.forEach((activity) => {
    if (activity.user) {
      userActivityCount[activity.user] =
        (userActivityCount[activity.user] || 0) + 1;
    }
  });

  // Count login/logout activities
  const loginCount = recentActivity.filter(
    (a) => a.activity_type === "login"
  ).length;
  const logoutCount = recentActivity.filter(
    (a) => a.activity_type === "logout"
  ).length;

  // Get most recent activity
  const mostRecent = recentActivity[0];

  return (
    <div className="bg-white rounded-xl p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">Recent Activity Summary</h4>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {recentActivity.length} events
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Active Users:</span>
          <span className="font-medium">
            {Object.keys(userActivityCount).length}
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <UserCheck className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-gray-600">{loginCount} logins</span>
          </div>
          <div className="flex items-center">
            <UserX className="w-4 h-4 text-red-500 mr-1" />
            <span className="text-sm text-gray-600">{logoutCount} logouts</span>
          </div>
        </div>

        {mostRecent && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
            Latest: {mostRecent.user} - {mostRecent.description}
          </div>
        )}
      </div>
    </div>
  );
};

const UserActivityLogPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewingActivity, setViewingActivity] = useState(null);
  const [deletingActivity, setDeletingActivity] = useState(null);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  // Get recent activity from store
  const { recentActivity, fetchLog, clearRecentActivity } = useActivityStore();

  const [filters, setFilters] = useState({
    activity_type: "all",
    timeframe: "today",
    user: "all",
  });

  const [users, setUsers] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [isRefreshingRecent, setIsRefreshingRecent] = useState(false);

  // Fetch recent activity when component mounts
  useEffect(() => {
    fetchLog(); // Fetch recent activity from store
    fetchActivities(); // Fetch all activities from API
  }, []);

  // Auto-refresh recent activity every 30 seconds
  useEffect(() => {
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        handleRefreshRecent();
      }, 30000); // 30 seconds
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh]);

  const fetchActivities = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/log/get-all-log`);
      if (!data.success) {
        throw new Error(data.message || "Failed to fetch activities");
      }
      setActivities(data.logs || []);

      // Extract unique users and activity types
      const uniqueUsers = [
        ...new Set(data.logs?.map((a) => a.user).filter(Boolean)),
      ];
      const uniqueTypes = [
        ...new Set(data.logs?.map((a) => a.activity_type).filter(Boolean)),
      ];

      setUsers(uniqueUsers);
      setActivityTypes(uniqueTypes);


      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Calculate active sessions (login events without corresponding recent logout)
      const recentLogins = data.logs.filter(
        (a) => a.activity_type === "login" && new Date(a.timestamp) >= today
      ).length;

      const recentLogouts = data.logs.filter(
        (a) => a.activity_type === "logout" && new Date(a.timestamp) >= today
      ).length;

      const activeSessions = Math.max(0, recentLogins - recentLogouts);

      // Use recent activity count from store
      const recentCount = recentActivity?.length || 0;
    } catch (error) {
      console.error("Error fetching activities:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load activities"
      );
    } finally {
      setLoading(false);
    }
  }, [recentActivity]);

  // Handle refresh of recent activities
  const handleRefreshRecent = async () => {
    setIsRefreshingRecent(true);
    try {
      await fetchLog();
      toast.success("Recent activities refreshed");
    } catch (error) {
      toast.error("Failed to refresh recent activities");
    } finally {
      setIsRefreshingRecent(false);
    }
  };

  // Get combined activities (recent + all)
  const getCombinedActivities = () => {
    const allActivities = [...activities];

    if (recentActivity && recentActivity.length > 0) {
      // Sort recent activities by timestamp (newest first)
      const sortedRecent = [...recentActivity].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      );

      sortedRecent.forEach((recent) => {
        // Check if this recent activity already exists in all activities
        const exists = allActivities.some(
          (activity) => activity.activity_id === recent.activity_id
        );

        if (!exists) {
          // Add recent activity at the beginning
          allActivities.unshift(recent);
        }
      });
    }

    // Sort all activities by timestamp (newest first)
    return allActivities.sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
  };

  // Filter activities
  const filteredActivities = getCombinedActivities().filter((activity) => {
    if (!activity) return false;

    const matchesSearch =
      (activity.description || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (activity.user || "")
        ?.toLowerCase()
        ?.includes(searchTerm.toLowerCase()) ||
      (activity.activity_type || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      (activity.details || "")
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesType =
      filters?.activity_type === "all" ||
      activity.activity_type === filters?.activity_type;

    const matchesUser =
      filters.user === "all" || activity.user === filters.user;

    // Timeframe filter
    const matchesTimeframe = (() => {
      if (filters?.timeframe === "all") return true;

      const now = new Date();
      const activityDate = new Date(activity.timestamp);

      switch (filters.timeframe) {
        case "today":
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return activityDate >= today;
        case "yesterday":
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          yesterday.setHours(0, 0, 0, 0);
          const yesterdayEnd = new Date(yesterday);
          yesterdayEnd.setDate(yesterdayEnd.getDate() + 1);
          return activityDate >= yesterday && activityDate < yesterdayEnd;
        case "week":
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return activityDate >= weekAgo;
        case "month":
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return activityDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesType && matchesUser && matchesTimeframe;
  });

  const handleDeleteActivity = async (activityId) => {
    if (!activityId) return;

    try {
      const { data } = await api.delete(`/activities/delete/${activityId}`);
      if (!data.success) {
        throw new Error(data.message || "Failed to delete activity");
      }

      toast.success("Activity log deleted successfully");
      fetchActivities();
    } catch (error) {
      console.error("Error deleting activity:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete activity"
      );
    } finally {
      setOpenConfirmModal(false);
      setDeletingActivity(null);
    }
  };

  const handleConfirmDelete = () => {
    if (deletingActivity) {
      handleDeleteActivity(deletingActivity.activity_id);
    }
  };

  const handleClearAllActivities = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear all activity logs? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const { data } = await api.delete("/activities/clear-all");
      if (!data.success) {
        throw new Error(data.message || "Failed to clear activities");
      }

      toast.success("All activity logs cleared successfully");
      fetchActivities();
      clearRecentActivity();
    } catch (error) {
      console.error("Error clearing activities:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to clear activities"
      );
    }
  };

  const handleExportActivities = async () => {
    try {
      const combinedActivities = getCombinedActivities();
      const csvData = [
        ["ID", "User", "Activity Type", "Description", "Timestamp", "User ID"],
        ...combinedActivities.map((activity) => [
          activity.activity_id,
          activity.user,
          activity.activity_type,
          activity.description,
          activity.timestamp,
          activity.user_id,
        ]),
      ]
        .map((row) => row.join(","))
        .join("\n");

      const blob = new Blob([csvData], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `activity-logs-${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success("Activity logs exported successfully");
    } catch (error) {
      console.error("Error exporting activities:", error);
      toast.error("Failed to export activity logs");
    }
  };

  // Group activities by date for timeline view
  const groupActivitiesByDate = (activities) => {
    const groups = {};
    activities.forEach((activity) => {
      const date = new Date(activity.timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });
    return groups;
  };

  const groupedActivities = groupActivitiesByDate(filteredActivities);

  // Refresh all activities
  const handleRefreshAll = async () => {
    try {
      await handleRefreshRecent();
      await fetchActivities();
      toast.success("All activities refreshed successfully");
    } catch (error) {
      console.error("Error refreshing activities:", error);
      toast.error("Failed to refresh activities");
    }
  };

  // Handle view recent activity details
  const handleViewRecentActivity = (activity) => {
    setViewingActivity(activity);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  User Activity Logs
                </h1>
                <p className="text-gray-600 mt-2">
                  Monitor and track all user activities across the platform
                </p>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={handleExportActivities}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Export Logs</span>
                </button>
                <button
                  onClick={handleClearAllActivities}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
                >
                  <Trash2 className="w-5 h-5" />
                  <span>Clear All</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Activities Section */}
          {recentActivity && recentActivity.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-4">
                <div className="flex items-center">
                  <Clock className="w-5 h-5 text-cyan-500 mr-2" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Recent Activities
                  </h3>
                  <span className="ml-3 text-sm text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">
                    Live Updates
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={clearRecentActivity}
                    className="text-sm text-gray-600 hover:text-gray-800 flex items-center"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Clear Recent
                  </button>
                  <button
                    onClick={handleRefreshRecent}
                    disabled={isRefreshingRecent}
                    className="text-sm text-cyan-600 hover:text-cyan-800 flex items-center disabled:opacity-50"
                  >
                    {isRefreshingRecent ? (
                      <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-1" />
                    )}
                    {isRefreshingRecent ? "Refreshing..." : "Refresh"}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recentActivity.slice(0, 4).map((activity, index) => (
                        <div
                          key={`recent-${index}-${activity.activity_id}`}
                          className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-cyan-100 hover:border-cyan-300 transition-colors cursor-pointer hover:shadow-md"
                          onClick={() => handleViewRecentActivity(activity)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                {activity.activity_type === "login" ? (
                                  <LogIn className="w-4 h-4 text-green-500 mr-2" />
                                ) : activity.activity_type === "logout" ? (
                                  <LogOut className="w-4 h-4 text-red-500 mr-2" />
                                ) : (
                                  <User className="w-4 h-4 text-gray-500 mr-2" />
                                )}
                                <h4 className="font-medium text-gray-900">
                                  {activity.user || "Unknown User"}
                                </h4>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {activity.description}
                              </p>
                            </div>
                            <RecentActivityBadge activity={activity} />
                          </div>
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>
                              {new Date(activity.timestamp).toLocaleTimeString(
                                [],
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </span>
                            <span className="flex items-center text-cyan-600">
                              <Eye className="w-3 h-3 mr-1" />
                              View Details
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                    {recentActivity.length > 4 && (
                      <div className="text-center mt-4">
                        <button
                          onClick={() => {
                            setFilters({
                              ...filters,
                              timeframe: "today",
                              activity_type: "all",
                            });
                            setSearchTerm("");
                          }}
                          className="text-sm text-cyan-600 hover:text-cyan-800 font-medium"
                        >
                          View all {recentActivity.length} recent activities →
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <UserActivitySummary recentActivity={recentActivity} />
                </div>
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search activities by description, user, or details..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap items-center gap-2">
                <select
                  value={filters.activity_type}
                  onChange={(e) =>
                    setFilters({ ...filters, activity_type: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Activity Types</option>
                  {activityTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace(/_/g, " ").toUpperCase()}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.user}
                  onChange={(e) =>
                    setFilters({ ...filters, user: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="all">All Users</option>
                  {users.map((user) => (
                    <option key={user} value={user}>
                      {user}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.timeframe}
                  onChange={(e) =>
                    setFilters({ ...filters, timeframe: e.target.value })
                  }
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  <option value="today">Today</option>
                  <option value="yesterday">Yesterday</option>
                  <option value="week">Last 7 Days</option>
                  <option value="month">Last 30 Days</option>
                  <option value="all">All Time</option>
                </select>

                <button
                  onClick={handleRefreshAll}
                  disabled={loading}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-1" />
                  )}
                  {loading ? "Loading..." : "Refresh All"}
                </button>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && filteredActivities.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <span className="ml-2 text-gray-600">
                Loading activity logs...
              </span>
            </div>
          )}

          {/* Content */}
          {!loading || filteredActivities.length > 0 ? (
            <>
              {/* Activity Logs */}
              <div className="space-y-8">
                {Object.entries(groupedActivities).map(
                  ([date, dateActivities]) => (
                    <div key={date}>
                      {/* Date Header */}
                      <div className="sticky top-0 z-10 bg-gray-50 py-3 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Calendar className="w-5 h-5 text-gray-400 mr-2" />
                            <h3 className="text-lg font-semibold text-gray-900">
                              {date}
                            </h3>
                            <span className="ml-3 text-sm text-gray-500 bg-gray-200 px-2 py-1 rounded-full">
                              {dateActivities.length} activities
                            </span>
                          </div>
                          {/* Highlight if this date has recent activities */}
                          {dateActivities.some((activity) =>
                            recentActivity?.some(
                              (recent) =>
                                recent.activity_id === activity.activity_id
                            )
                          ) && (
                            <span className="flex items-center text-sm text-cyan-600 bg-cyan-50 px-2 py-1 rounded-full">
                              <Zap className="w-3 h-3 mr-1" />
                              Contains Recent Activities
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Activities for this date */}
                      <div className="space-y-3">
                        {dateActivities.map((activity) => {
                          const isRecent = recentActivity?.some(
                            (recent) =>
                              recent.activity_id === activity.activity_id
                          );

                          return (
                            <div
                              key={activity.activity_id}
                              className={`group ${
                                isRecent
                                  ? "bg-gradient-to-r from-cyan-50 rounded-2xl to-white border-l-4 border-l-cyan-500"
                                  : ""
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                {/* Activity Card */}
                                <div className="flex-1">
                                  <ActivityLogCard
                                    activity={activity}
                                    isRecent={isRecent}
                                  />
                                </div>

                                {/* Action Buttons */}
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="flex space-x-1">
                                    <button
                                      onClick={() =>
                                        setViewingActivity(activity)
                                      }
                                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                      aria-label="View details"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </button>
                                  
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* Empty State */}
              {!loading && filteredActivities.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No activity logs found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm ||
                    filters.activity_type !== "all" ||
                    filters.timeframe !== "all"
                      ? "Try adjusting your search or filters"
                      : "No activities have been logged yet"}
                  </p>
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setFilters({
                        activity_type: "all",
                        timeframe: "all",
                        user: "all",
                      });
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Show count */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center space-x-4">
                    <span>
                      Showing {filteredActivities.length} of{" "}
                      {activities.length + (recentActivity?.length || 0)}{" "}
                      activities
                    </span>
                    {recentActivity && recentActivity.length > 0 && (
                      <span className="flex items-center text-cyan-600">
                        <Zap className="w-3 h-3 mr-1" />
                        {recentActivity.length} recent activities
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      window.scrollTo({ top: 0, behavior: "smooth" })
                    }
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Back to top ↑
                  </button>
                </div>
              </div>
            </>
          ) : null}

          {/* Activity Detail Modal */}
          {viewingActivity && (
            <ActivityDetailModal
              activity={viewingActivity}
              onClose={() => setViewingActivity(null)}
            />
          )}

          {/* Confirm Delete Modal */}
          {openConfirmModal && deletingActivity && (
            <ConfirmModal
              title="Delete Activity Log"
              message={`Are you sure you want to delete this activity log? This action cannot be undone.`}
              variant="danger"
              isOpen={openConfirmModal}
              onConfirm={handleConfirmDelete}
              onClose={() => {
                setOpenConfirmModal(false);
                setDeletingActivity(null);
              }}
              confirmText="Delete Log"
              cancelText="Cancel"
            />
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default UserActivityLogPage;

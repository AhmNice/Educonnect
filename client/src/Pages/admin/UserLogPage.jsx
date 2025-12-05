import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../../layout/PageLayout";
import { useActivityStore } from "../../store/logStore";
import ActivityLogCard from "../../components/ActivityLogCard";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import {
  User,
  Mail,
  Calendar,
  Clock,
  ArrowLeft,
  RefreshCw,
  Loader2,
  UserCheck,
  UserX,
  FileText,
  Activity,
  Shield,
  Filter,
  Search,
} from "lucide-react";

const UserLogPage = () => {
  const { user_id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { fetch_user_log, userActivity } = useActivityStore();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [activityType, setActivityType] = useState("all");
  const [timeFrame, setTimeFrame] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  const fetchUserProfile = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.get(`/users/get-user/${user_id}`);
      if (data.success) {
        setUser(data.user);
      } else {
        toast.error(data.message || "User not found");
        navigate("/admin/users");
      }
    } catch (error) {
      toast.error("Failed to load user profile");
      navigate("/admin/users");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserActivities = async () => {
    setIsRefreshing(true);
    try {
      await fetch_user_log(user_id);
    } catch (error) {
      console.error("Error fetching user activities:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    await Promise.all([fetchUserProfile(), fetchUserActivities()]);
    toast.success("Data refreshed");
  };

  useEffect(() => {
    if (user_id) {
      fetchUserProfile();
      fetchUserActivities();
    }
  }, [user_id]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Get unique activity types from user's activities
  const getUniqueActivityTypes = () => {
    if (!userActivity || userActivity.length === 0) return [];
    const types = [
      ...new Set(userActivity.map((activity) => activity.activity_type)),
    ];
    return types.sort();
  };

  // Filter activities based on search term, activity type, and timeframe
  const filteredActivities = () => {
    if (!userActivity) return [];

    let filtered = [...userActivity];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (activity) =>
          activity.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          activity.activity_type
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    // Filter by activity type
    if (activityType !== "all") {
      filtered = filtered.filter(
        (activity) => activity.activity_type === activityType
      );
    }

    // Filter by timeframe
    if (timeFrame !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch (timeFrame) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "yesterday":
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const yesterdayEnd = new Date(startDate);
          yesterdayEnd.setDate(yesterdayEnd.getDate() + 1);
          filtered = filtered.filter((activity) => {
            const activityDate = new Date(activity.timestamp);
            return activityDate >= startDate && activityDate < yesterdayEnd;
          });
          break;
        case "week":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          break;
      }

      if (timeFrame !== "yesterday") {
        filtered = filtered.filter(
          (activity) => new Date(activity.timestamp) >= startDate
        );
      }
    }

    return filtered;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setActivityType("all");
    setTimeFrame("all");
  };

  // Calculate stats based on filtered activities
  const filteredActivitiesList = filteredActivities();

  const loginCount =
    filteredActivitiesList?.filter(
      (activity) => activity.activity_type === "login"
    ).length || 0;

  const logoutCount =
    filteredActivitiesList?.filter(
      (activity) => activity.activity_type === "logout"
    ).length || 0;

  const lastActive =
    filteredActivitiesList && filteredActivitiesList.length > 0
      ? filteredActivitiesList[0]?.timestamp
      : null;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 p-6">
          <div className="text-center py-12">
            <UserX className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              User not found
            </h3>
            <button
              onClick={() => navigate("/admin/users")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Back to Users
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate("/admin/users")}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {user.full_name}'s Activity
                  </h1>
                  <p className="text-gray-600 text-sm">
                    User ID: {user.user_id}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2 disabled:opacity-50"
                >
                  {isRefreshing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-xl p-4 md:p-6 border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <h2 className="text-lg font-bold text-gray-900">
                    {user.full_name}
                  </h2>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === "admin"
                        ? "bg-purple-100 text-purple-800"
                        : user.role === "student"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.role}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {user.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {formatDate(user.created_at)}
                  </div>
                  {lastActive && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      Last active {formatDate(lastActive)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Activities</p>
                  <p className="text-xl font-bold text-gray-900">
                    {filteredActivitiesList.length}
                  </p>
                </div>
                <Activity className="w-8 h-8 text-blue-500" />
              </div>
              {userActivity?.length !== filteredActivitiesList.length && (
                <p className="text-xs text-gray-500 mt-1">
                  Filtered from {userActivity?.length || 0}
                </p>
              )}
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Logins</p>
                  <p className="text-xl font-bold text-green-600">
                    {loginCount}
                  </p>
                </div>
                <UserCheck className="w-8 h-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Logouts</p>
                  <p className="text-xl font-bold text-red-600">
                    {logoutCount}
                  </p>
                </div>
                <UserX className="w-8 h-8 text-red-500" />
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">User ID</p>
                  <p className="text-xs font-mono text-gray-900 truncate">
                    {user.user_id?.slice(0, 8)}...
                  </p>
                </div>
                <Shield className="w-8 h-8 text-purple-500" />
              </div>
            </div>
          </div>
          {/* Filters Section */}
          {showFilters && (
            <div className="bg-white rounded-xl p-4 border border-gray-200 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <select
                    value={activityType}
                    onChange={(e) => setActivityType(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Types</option>
                    {getUniqueActivityTypes().map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>

                  <select
                    value={timeFrame}
                    onChange={(e) => setTimeFrame(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>

                  {(searchTerm ||
                    activityType !== "all" ||
                    timeFrame !== "all") && (
                    <button
                      onClick={clearFilters}
                      className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              </div>

              {/* Active Filters Indicator */}
              {(searchTerm ||
                activityType !== "all" ||
                timeFrame !== "all") && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-sm text-gray-600">
                    <Filter className="w-3 h-3 mr-2" />
                    <span>Active filters: </span>
                    {searchTerm && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                        Search: "{searchTerm}"
                      </span>
                    )}
                    {activityType !== "all" && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                        Type: {activityType}
                      </span>
                    )}
                    {timeFrame !== "all" && (
                      <span className="ml-2 px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                        Time: {timeFrame}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          {/* Activity Logs */}
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-4 md:p-6 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Activity History
                  </h3>
                  <p className="text-sm text-gray-500">
                    {filteredActivitiesList.length} of{" "}
                    {userActivity?.length || 0} activities
                    {(searchTerm ||
                      activityType !== "all" ||
                      timeFrame !== "all") &&
                      " (filtered)"}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {!showFilters && (
                    <button
                      onClick={() => setShowFilters(true)}
                      className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2"
                    >
                      <Filter className="w-4 h-4" />
                      <span>Show Filters</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6">
              {isRefreshing ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                  <span className="ml-2 text-gray-600">
                    Loading activities...
                  </span>
                </div>
              ) : filteredActivitiesList.length > 0 ? (
                <div className="space-y-3">
                  {filteredActivitiesList.map((log) => (
                    <ActivityLogCard key={log.activity_id} activity={log} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No Activities Found
                  </h4>
                  <p className="text-gray-500 mb-4">
                    {searchTerm || activityType !== "all" || timeFrame !== "all"
                      ? "No activities match your filters. Try adjusting your search criteria."
                      : "No activities recorded for this user."}
                  </p>
                  {(searchTerm ||
                    activityType !== "all" ||
                    timeFrame !== "all") && (
                    <button
                      onClick={clearFilters}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default UserLogPage;

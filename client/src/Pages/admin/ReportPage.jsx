import React, { useState, useEffect } from "react";
import PageLayout from "../../layout/PageLayout";
import api from "../../lib/axios";
import { toast } from "react-toastify";
import {
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Trash2,
  Filter,
  Search,
  Calendar,
  User,
  RefreshCw,
  MessageSquare,
  Flag,
  Shield,
  Download,
  MoreVertical,
  Loader2,
  ChevronDown,
  FileText,
  UserCheck,
  UserX,
  Mail,
  ExternalLink,
} from "lucide-react";

const ReportsListPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedReports, setSelectedReports] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reportToDelete, setReportToDelete] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [viewingReport, setViewingReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dateRange: "all",
    reporter: "all",
    reportedUser: "all",
  });

  // Users for filters
  const [reporters, setReporters] = useState([]);
  const [reportedUsers, setReportedUsers] = useState([]);

  // Report statuses
  const reportStatuses = ["pending", "reviewed", "resolved", "dismissed"];

  // Fetch reports
  const fetchReports = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/reports/all");
      if (data.success) {
        setReports(data.reports);
        setFilteredReports(data.reports);

        // Extract unique users for filters
        const uniqueReporters = [...new Set(data.reports.map(r => r.reporter_id))];
        const uniqueReported = [...new Set(data.reports.map(r => r.reported_user_id))];

        // Fetch user details for these IDs (you might need to adjust this)
        setReporters(uniqueReporters);
        setReportedUsers(uniqueReported);
      } else {
        throw new Error(data.message || "Failed to fetch reports");
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to load reports"
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch user details (you'll need to implement this based on your API)
  const fetchUserDetails = async (userId) => {
    try {
      const { data } = await api.get(`/users/${userId}`);
      return data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...reports];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (report) =>
          report.reason?.toLowerCase().includes(searchTerm) ||
          report.report_id?.toString().includes(searchTerm)
      );
    }

    // Status filter
    if (filters.status !== "all") {
      filtered = filtered.filter((report) => report.status === filters.status);
    }

    // Date range filter
    if (filters.dateRange !== "all") {
      const now = new Date();
      let startDate = new Date();

      switch (filters.dateRange) {
        case "today":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "yesterday":
          startDate.setDate(startDate.getDate() - 1);
          startDate.setHours(0, 0, 0, 0);
          const yesterdayEnd = new Date(startDate);
          yesterdayEnd.setDate(yesterdayEnd.getDate() + 1);
          filtered = filtered.filter((report) => {
            const reportDate = new Date(report.created_at);
            return reportDate >= startDate && reportDate < yesterdayEnd;
          });
          return;
        case "week":
          startDate.setDate(startDate.getDate() - 7);
          break;
        case "month":
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        default:
          break;
      }

      if (filters.dateRange !== "yesterday") {
        filtered = filtered.filter(
          (report) => new Date(report.created_at) >= startDate
        );
      }
    }

    // Reporter filter
    if (filters.reporter !== "all") {
      filtered = filtered.filter((report) =>
        report.reporter_id.toString() === filters.reporter
      );
    }

    // Reported user filter
    if (filters.reportedUser !== "all") {
      filtered = filtered.filter((report) =>
        report.reported_user_id.toString() === filters.reportedUser
      );
    }

    setFilteredReports(filtered);
  }, [filters, reports]);

  // Handle select/deselect all
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReports(filteredReports.map((report) => report.report_id));
    } else {
      setSelectedReports([]);
    }
  };

  // Handle individual report selection
  const handleReportSelect = (reportId) => {
    if (selectedReports.includes(reportId)) {
      setSelectedReports(selectedReports.filter((id) => id !== reportId));
    } else {
      setSelectedReports([...selectedReports, reportId]);
    }
  };

  // Delete single report
  const handleDeleteReport = async (reportId) => {
    try {
      const { data } = await api.delete(`/reports/${reportId}`);
      if (data.success) {
        toast.success("Report deleted successfully");
        fetchReports();
        setSelectedReports(selectedReports.filter((id) => id !== reportId));
      } else {
        throw new Error(data.message || "Failed to delete report");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete report"
      );
    } finally {
      setShowDeleteModal(false);
      setReportToDelete(null);
    }
  };

  // Delete multiple reports
  const handleDeleteMultiple = async () => {
    if (selectedReports.length === 0) return;

    if (
      !window.confirm(
        `Are you sure you want to delete ${selectedReports.length} selected reports?`
      )
    ) {
      return;
    }

    try {
      const { data } = await api.delete("/reports/bulk", {
        data: { reportIds: selectedReports },
      });
      if (data.success) {
        toast.success(`${selectedReports.length} reports deleted successfully`);
        fetchReports();
        setSelectedReports([]);
      } else {
        throw new Error(data.message || "Failed to delete reports");
      }
    } catch (error) {
      console.error("Error deleting reports:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to delete reports"
      );
    }
  };

  // Update report status
  const handleUpdateStatus = async (reportId, newStatus) => {
    setUpdatingStatus(true);
    try {
      const { data } = await api.put(`/reports/${reportId}/status`, {
        status: newStatus,
      });
      if (data.success) {
        toast.success(`Report status updated to ${newStatus}`);
        fetchReports();
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Export reports
  const handleExportReports = async (format = "csv") => {
    try {
      const response = await api.get("/reports/export", {
        params: { format },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `user-reports-${new Date().toISOString().split("T")[0]}.${format}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success(`Reports exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error("Error exporting reports:", error);
      toast.error("Failed to export reports");
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      search: "",
      status: "all",
      dateRange: "all",
      reporter: "all",
      reportedUser: "all",
    });
  };

  // Get status color and icon
  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: Clock,
          iconColor: "text-yellow-500",
        };
      case "reviewed":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: Eye,
          iconColor: "text-blue-500",
        };
      case "resolved":
        return {
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
          iconColor: "text-green-500",
        };
      case "dismissed":
        return {
          color: "bg-red-100 text-red-800",
          icon: XCircle,
          iconColor: "text-red-500",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: Clock,
          iconColor: "text-gray-500",
        };
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // View report details
  const handleViewReport = async (report) => {
    setViewingReport(report);
    setShowReportModal(true);
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  User Reports
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage user complaints and reports
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleExportReports}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export Reports</span>
                </button>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <Filter className="w-4 h-4" />
                  <span>Filter</span>
                </button>
                <button
                  onClick={fetchReports}
                  className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Reports</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reports.length}
                  </p>
                </div>
                <Flag className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {reports.filter(r => r.status === "pending").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Resolved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {reports.filter(r => r.status === "resolved").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dismissed</p>
                  <p className="text-2xl font-bold text-red-600">
                    {reports.filter(r => r.status === "dismissed").length}
                  </p>
                </div>
                <XCircle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedReports.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-medium">
                    {selectedReports.length} reports selected
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => selectedReports.forEach(id =>
                      handleUpdateStatus(id, "reviewed")
                    )}
                    className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                    disabled={updatingStatus}
                  >
                    <Eye className="w-4 h-4" />
                    <span>Mark as Reviewed</span>
                  </button>
                  <button
                    onClick={() => selectedReports.forEach(id =>
                      handleUpdateStatus(id, "resolved")
                    )}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                    disabled={updatingStatus}
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>Mark as Resolved</span>
                  </button>
                  <button
                    onClick={handleDeleteMultiple}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Selected</span>
                  </button>
                  <button
                    onClick={() => setSelectedReports([])}
                    className="px-3 py-1.5 border border-gray-300 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Selection
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Filters Section */}
          {showFilters && (
            <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Search */}
                <div className="lg:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Reports
                  </label>
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search by reason or report ID..."
                      value={filters.search}
                      onChange={(e) =>
                        setFilters({ ...filters, search: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filters.status}
                    onChange={(e) =>
                      setFilters({ ...filters, status: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Status</option>
                    {reportStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) =>
                      setFilters({ ...filters, dateRange: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>
                </div>

                {/* Reporter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reporter
                  </label>
                  <select
                    value={filters.reporter}
                    onChange={(e) =>
                      setFilters({ ...filters, reporter: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Reporters</option>
                    {reporters.map((reporterId) => (
                      <option key={reporterId} value={reporterId}>
                        User #{reporterId}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reported User */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reported User
                  </label>
                  <select
                    value={filters.reportedUser}
                    onChange={(e) =>
                      setFilters({ ...filters, reportedUser: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="all">All Users</option>
                    {reportedUsers.map((userId) => (
                      <option key={userId} value={userId}>
                        User #{userId}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
                <div className="text-sm text-gray-600">
                  Showing {filteredReports.length} of {reports.length} reports
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reports Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={
                          filteredReports.length > 0 &&
                          selectedReports.length === filteredReports.length
                        }
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Report
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Users
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-12">
                        <div className="flex justify-center items-center">
                          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                          <span className="ml-2 text-gray-600">
                            Loading reports...
                          </span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredReports.length > 0 ? (
                    filteredReports.map((report) => {
                      const statusInfo = getStatusInfo(report.status);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <tr
                          key={report.report_id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="checkbox"
                              checked={selectedReports.includes(report.report_id)}
                              onChange={() => handleReportSelect(report.report_id)}
                              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-start">
                              <div className="flex-shrink-0 mt-1">
                                <Flag className="w-5 h-5 text-gray-400" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm text-gray-900 line-clamp-2">
                                  {report.reason}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  ID: {report.report_id}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="flex items-center text-sm">
                                <User className="w-4 h-4 text-green-500 mr-2" />
                                <span className="text-gray-700">
                                  Reporter: User #{report.reporter_id}
                                </span>
                              </div>
                              <div className="flex items-center text-sm">
                                <User className="w-4 h-4 text-red-500 mr-2" />
                                <span className="text-gray-700">
                                  Reported: User #{report.reported_user_id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <StatusIcon className={`w-4 h-4 mr-2 ${statusInfo.iconColor}`} />
                              <span
                                className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusInfo.color}`}
                              >
                                {report.status.toUpperCase()}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                              {formatDate(report.created_at)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleViewReport(report)}
                                className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <div className="relative group">
                                <button
                                  className="text-gray-600 hover:text-gray-900 p-1 hover:bg-gray-50 rounded"
                                  title="Change Status"
                                >
                                  <MoreVertical className="w-4 h-4" />
                                </button>
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 hidden group-hover:block">
                                  <div className="py-1">
                                    <button
                                      onClick={() => handleUpdateStatus(report.report_id, "reviewed")}
                                      className="flex items-center w-full px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      Mark as Reviewed
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStatus(report.report_id, "resolved")}
                                      className="flex items-center w-full px-4 py-2 text-sm text-green-600 hover:bg-green-50"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />
                                      Mark as Resolved
                                    </button>
                                    <button
                                      onClick={() => handleUpdateStatus(report.report_id, "dismissed")}
                                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />
                                      Dismiss Report
                                    </button>
                                    <div className="border-t border-gray-100 my-1"></div>
                                    <button
                                      onClick={() => {
                                        setReportToDelete(report);
                                        setShowDeleteModal(true);
                                      }}
                                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4 mr-2" />
                                      Delete Report
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-12">
                        <div className="text-center">
                          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            No reports found
                          </h3>
                          <p className="text-gray-500 mb-4">
                            {filters.search || filters.status !== "all"
                              ? "Try adjusting your filters"
                              : "No user reports have been submitted yet"}
                          </p>
                          {filters.search || filters.status !== "all" ? (
                            <button
                              onClick={clearFilters}
                              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                            >
                              Clear Filters
                            </button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination/Info */}
          <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between">
            <div className="text-sm text-gray-600">
              Showing {filteredReports.length} of {reports.length} reports
            </div>
            <div className="flex items-center space-x-2 mt-4 md:mt-0">
              <button
                onClick={handleExportReports}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export All</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && reportToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Report
              </h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this report? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setReportToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteReport(reportToDelete.report_id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
              >
                Delete Report
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Detail Modal */}
      {showReportModal && viewingReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <Flag className="w-6 h-6 text-blue-500" />
                <h2 className="text-xl font-bold text-gray-900">
                  Report Details
                </h2>
              </div>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Report Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Report ID
                  </h4>
                  <p className="text-gray-900 font-mono">{viewingReport.report_id}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Status
                  </h4>
                  <div className="flex items-center">
                    {(() => {
                      const statusInfo = getStatusInfo(viewingReport.status);
                      const StatusIcon = statusInfo.icon;
                      return (
                        <>
                          <StatusIcon className={`w-4 h-4 mr-2 ${statusInfo.iconColor}`} />
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusInfo.color}`}>
                            {viewingReport.status.toUpperCase()}
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Users Involved */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">
                  Users Involved
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <UserCheck className="w-4 h-4 text-green-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Reporter
                      </span>
                    </div>
                    <p className="text-gray-900">User #{viewingReport.reporter_id}</p>
                  </div>
                  <div>
                    <div className="flex items-center mb-2">
                      <UserX className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">
                        Reported User
                      </span>
                    </div>
                    <p className="text-gray-900">User #{viewingReport.reported_user_id}</p>
                  </div>
                </div>
              </div>

              {/* Report Reason */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Report Reason
                </h4>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {viewingReport.reason}
                </p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Created At
                  </h4>
                  <div className="flex items-center text-gray-900">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    {formatDate(viewingReport.created_at)}
                  </div>
                </div>
                {viewingReport.updated_at && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Last Updated
                    </h4>
                    <div className="flex items-center text-gray-900">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(viewingReport.updated_at)}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowReportModal(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleUpdateStatus(viewingReport.report_id, "resolved");
                    setShowReportModal(false);
                  }}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Mark as Resolved
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default ReportsListPage;
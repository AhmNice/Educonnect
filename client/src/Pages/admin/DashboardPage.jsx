import React, { useEffect } from "react";
import PageLayout from "../../layout/PageLayout";
import {
  Users,
  BookOpen,
  MessageSquare,
  AlertTriangle,
  BarChart3,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Shield,
  CheckCircle,
  XCircle,
} from "lucide-react";

import StatCard from "../../components/cards/StatCard";
import { useAuthStore } from "../../store/authStore";
import { useStatsStore } from "../../store/statsStore";
import { useNavigate } from "react-router-dom";
import ActivityLogList from "../../components/ActivityList";
import { useActivityStore } from "../../store/logStore";
const Admin_DashboardPage = () => {
  const { user } = useAuthStore();
  const { platformMetrics, fetch_platform_metrics } = useStatsStore();
  const { fetchLog, recentActivity } = useActivityStore()
  const navigate = useNavigate();
  // Mock data

  useEffect(() => {
    const fetch_metric = async () => {
      await fetch_platform_metrics();
      await fetchLog()
    };
    fetch_metric();
  }, []);

  useEffect(() => {
    document.title = "Dashboard - EduConnect Admin";
  }, []);
  const userDistribution = {
    students: 11200,
    tutors: 1343,
    admins: 12,
  };


  const pendingReports = [
    {
      id: 1,
      type: "inappropriate_content",
      user: "user123",
      description: "Inappropriate message in group chat",
      severity: "medium",
      date: "2 hours ago",
    },
    {
      id: 2,
      type: "spam",
      user: "user456",
      description: "Multiple spam messages",
      severity: "low",
      date: "5 hours ago",
    },
    {
      id: 3,
      type: "harassment",
      user: "user789",
      description: "User harassment complaint",
      severity: "high",
      date: "1 day ago",
    },
  ];

  // User Table Row Component
  const UserRow = ({ user, selected, onSelect }) => (
    <tr
      className={`border-b border-gray-200 hover:bg-gray-50 ${
        selected ? "bg-blue-50" : ""
      }`}
    >
      <td className="px-6 py-4 whitespace-nowrap">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(user.id)}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
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
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
        {user.university.name}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            user.status === "active"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {user.status}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {user.joinDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex items-center justify-end space-x-2">
          <button className="text-blue-600 hover:text-blue-900 transition-colors">
            <Eye className="w-4 h-4" />
          </button>
          <button className="text-green-600 hover:text-green-900 transition-colors">
            <Edit className="w-4 h-4" />
          </button>
          <button className="text-red-600 hover:text-red-900 transition-colors">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  // Report Card Component
  const ReportCard = ({ report }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-md transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{report.description}</h3>
          <p className="text-sm text-gray-600 mt-1">
            Reported by: {report.user}
          </p>
        </div>
        <span
          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
            report.severity === "high"
              ? "bg-red-100 text-red-800"
              : report.severity === "medium"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {report.severity}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{report.date}</span>
        <div className="flex space-x-2">
          <button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Resolve
          </button>
          <button className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors flex items-center">
            <XCircle className="w-4 h-4 mr-1" />
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
  return (
    <PageLayout>
      <div className="min-h-screen bg-gray-50 p-2 lg:p-6 pt-2 ">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 mt-2">
                  Platform overview and management tools
                </p>
              </div>
            </div>
          </div>

          {/* Overview Tab */}
          <>
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={Users}
                title="Total Users"
                value={platformMetrics.total_users}
                change={12.5}
                color="bg-blue-500"
              />
              <StatCard
                icon={BookOpen}
                title="Active Users"
                value={platformMetrics.total_active_users}
                change={8.2}
                color="bg-green-500"
              />
              <StatCard
                icon={MessageSquare}
                title="Study Groups"
                value={platformMetrics.total_study_groups}
                change={15.3}
                color="bg-purple-500"
              />
              <StatCard
                icon={AlertTriangle}
                title="Pending Reports"
                value={platformMetrics.pendingReports}
                change={-5.2}
                color="bg-orange-500"
              />
            </div>

            {/* Recent Activity & Pending Reports */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Activity */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Recent Activity
                </h3>
                <div className="space-y-4">
                  <ActivityLogList activities={recentActivity}/>
                </div>
              </div>

              {/* Pending Reports */}
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Pending Reports
                  </h3>
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {pendingReports.length} pending
                  </span>
                </div>
                <div className="space-y-4">
                  {pendingReports.map((report) => (
                    <ReportCard key={report.id} report={report} />
                  ))}
                </div>
              </div>
            </div>

            <div className=" grid grid-cols-2 lg:grid-cols-2 gap-8 pt-4">
              <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Quick Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      navigate("/admin/users");
                    }}
                    className="w-full bg-blue-50 text-blue-700 p-3 rounded-xl hover:bg-blue-100 transition-colors duration-200 flex items-center justify-between"
                  >
                    <span>Manage Users</span>
                    <Users className="w-4 h-4" />
                  </button>
                  <button className="w-full bg-green-50 text-green-700 p-3 rounded-xl hover:bg-green-100 transition-colors duration-200 flex items-center justify-between">
                    <span>Course Management</span>
                    <BookOpen className="w-4 h-4" />
                  </button>
                  <button className="w-full bg-purple-50 text-purple-700 p-3 rounded-xl hover:bg-purple-100 transition-colors duration-200 flex items-center justify-between">
                    <span>View Reports</span>
                    <AlertTriangle className="w-4 h-4" />
                  </button>
                  <button className="w-full bg-orange-50 text-orange-700 p-3 rounded-xl hover:bg-orange-100 transition-colors duration-200 flex items-center justify-between">
                    <span>Platform Analytics</span>
                    <BarChart3 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </>
        </div>
      </div>
    </PageLayout>
  );
};

export default Admin_DashboardPage;

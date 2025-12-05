import React, { useState } from "react";
import {
  BookOpen,
  Users,
  Bell,
  MessageSquare,
  Calendar,
  BarChart3,
  Search,
  Clock,
  FileText,
  Plus,
  TrendingUp,
  Award,
  Download,
  Share2,
} from "lucide-react";
import PageLayout from "../layout/PageLayout";
import StudyGroupCard from "../components/cards/StudyGroupCard";
import StatCard from "../components/cards/StatCard";
import { useAuthStore } from "../store/authStore";
import { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import api from "../lib/axios";
import { useActivityStore } from "../store/logStore";
const Dashboard = () => {
  // Mock user data
  const { user } = useAuthStore();
  const [topGroup, setTopGroup] = useState([]);
  const { fetch_my_log, myActivity } = useActivityStore();
  // Mock data

  useEffect(() => {
    const fetchTopGroups = async () => {
      try {
        const { data } = await api.get("/group/get-top-groups");
        if (data.success) {
          setTopGroup(data.groups);
        }
      } catch (error) {
        console.error("Error fetching top groups:", error);
      }
    };
    fetchTopGroups();
  }, []);
  useEffect(() => {
    const fetchLog = async () => {
      await fetch_my_log();
    };
    fetchLog();
  }, []);

  const navigate = useNavigate();
  const metrics = {
    coursesEnrolled: 3,
    topGroup: 2,
    unreadMessages: 5,
  };
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
  // Activity Item Component
  const ActivityItem = ({ activity }) => {
    const getIcon = (type) => {
      switch (type) {
        case "message":
          return <MessageSquare className="w-4 h-4 text-blue-500" />;
        case "resource":
          return <FileText className="w-4 h-4 text-green-500" />;
        case "notification":
          return <Bell className="w-4 h-4 text-orange-500" />;
        case "login":
          return <Clock className="w-4 h-4 text-gray-500" />;
        default:
          return <Clock className="w-4 h-4 text-gray-500" />;
      }
    };

    return (
      <div className="flex items-start space-x-3 py-3 border-b border-gray-100 last:border-0">
        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          {getIcon(activity.activity_type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800">{activity.description}</p>
          <p className="text-xs text-gray-500 mt-1">
            {formatFullDate(activity.timestamp)}
          </p>
        </div>
      </div>
    );
  };

  return (
    <PageLayout allowDefaultPadding={true}>
      <div className="min-h-screen bg-gray-50 p-2 lg:p-6 pt-2 ">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Hello,{" "}
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {user?.full_name}
                  </span>
                  !
                </h1>
                <p className="text-gray-600 mt-2">
                  Student at {user?.university?.name} • {user?.department}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Last login: {user?.lastLogin}
                </p>
              </div>
              <div className=" flex flex-col md:flex-row mt-4 lg:mt-0 flex md:items-center gap-2 space-x-4">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search courses, resources..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64"
                  />
                </div>
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>New Group</span>
                </button>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <StatCard
              icon={BookOpen}
              title="Courses Enrolled"
              value={metrics.coursesEnrolled}
              color="bg-blue-500"
            />
            <StatCard
              icon={Users}
              title="Study Groups"
              value={metrics.topGroup}
              color="bg-green-500"
            />
            <StatCard
              icon={MessageSquare}
              title="Unread Messages"
              value={metrics.unreadMessages}
              color="bg-purple-500"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Courses & Groups */}
            <div className="lg:col-span-2 space-y-8">
              {/* Study Groups */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Top 3 Study Groups
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {topGroup.map((group) => (
                    <StudyGroupCard key={group.id} group={group} />
                  ))}
                </div>
              </section>
              {/* Quick Actions */}
              <section className="">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Quick Actions
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                  onClick={()=>navigate('/messages')}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-center group">
                    <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-gray-900">Messages</span>
                  </button>
                  <button
                  onClick={()=> navigate('/resources')}
                  className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-center group">
                    <Download className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-gray-900">Resources</span>
                  </button>

                </div>
              </section>
            </div>

            {/* Right Column - Activity & Quick Actions */}
            <div className="space-y-8 bg-white p-4">
              {/* Recent Activity */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">
                    Recent Activity
                  </h2>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                  {myActivity.slice(0, 4).map((activity) => (
                    <ActivityItem
                      key={activity.activity_id}
                      activity={activity}
                    />
                  ))}
                </div>
              </section>


            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;

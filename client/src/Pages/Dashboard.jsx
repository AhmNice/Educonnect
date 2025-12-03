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
const Dashboard = () => {
  // Mock user data
  const { user } = useAuthStore();

  // Mock data

  const studyGroups = [
    {
      group_id: "1",
      group_name: "CS-201 Study Group",
      course: "Data Structures",
      description: "Weekly study sessions for Data Structures midterm preparation and algorithm practice.",
      current_members: 8,
      max_members: 15,
      meeting_schedule: "Every Monday, 3:00 PM",
      status: "active",
      visibility: "public",
      tags: ["algorithms", "programming", "java"],
      created_at: "2024-01-15",
      creator: {
        full_name: "John Doe",
        user_id:"31439b73-61bf-432e-9fec-d53d29a3c148",
        university: "Stanford University"
      },
      member_count: 8
    },
    {
      group_id: "2",
      group_name: "Math Study Buddies",
      course: "Calculus I",
      description: "Collaborative problem solving and concept review for Calculus I.",
      current_members: 5,
      max_members: 10,
      meeting_schedule: "Friday, 2:00 PM",
      status: "active",
      visibility: "public",
      tags: ["mathematics", "calculus", "problem-solving"],
      created_at: "2024-01-10",
      creator: {
        full_name: "Sarah Wilson",
        user_id:"31439b73-61bf-432e-9fec-d53d79a3c148",
        university: "MIT"
      },
      member_count: 5
    },
    {
      group_id: "3",
      group_name: "Physics Lab Partners",
      course: "Physics Lab",
      description: "Lab report collaboration and experiment discussion for Physics Laboratory.",
      current_members: 3,
      max_members: 6,
      meeting_schedule: "Wednesday, 4:30 PM",
      status: "active",
      visibility: "public",
      tags: ["physics", "lab", "experiments"],
      created_at: "2024-01-20",
      creator: {
        full_name: "Mike Chen",
        user_id:"31439b73-61bf-432e-9fec-d54d09a3c148",
        university: "Harvard University"
      },
      member_count: 3
    },

  ];

  const recentActivity = [
    {
      id: 1,
      type: "message",
      content: "New message in CS-201 Study Group",
      time: "10 min ago",
    },
    {
      id: 2,
      type: "resource",
      content: "Sarah shared lecture notes",
      time: "1 hour ago",
    },
    {
      id: 3,
      type: "notification",
      content: "Assignment due tomorrow",
      time: "2 hours ago",
    },
    { id: 4, type: "login", content: "You logged in", time: "2 hours ago" },
  ];
  const navigate = useNavigate();
  const metrics = {
    coursesEnrolled: 3,
    studyGroups: 2,
    unreadMessages: 5,
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
          {getIcon(activity.type)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-800">{activity.content}</p>
          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
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
                Student at{" "}
                  {user?.university?.name} • {user?.department}
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
              value={metrics.studyGroups}
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
                  {studyGroups.map((group) => (
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
                  <button className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-center group">
                    <MessageSquare className="w-8 h-8 text-blue-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-gray-900">Messages</span>
                  </button>
                  <button className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-center group">
                    <Bell className="w-8 h-8 text-orange-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-gray-900">
                      Notifications
                    </span>
                  </button>
                  <button className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-center group">
                    <Download className="w-8 h-8 text-green-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-gray-900">Resources</span>
                  </button>
                  <button className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1 text-center group">
                    <Share2 className="w-8 h-8 text-purple-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                    <span className="font-medium text-gray-900">Share</span>
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
                  <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors">
                    View All
                  </button>
                </div>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                  {recentActivity.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </section>

              {/* Analytics Summary */}
              <section>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Study Analytics
                </h2>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="font-semibold text-gray-900">
                        Weekly Progress
                      </span>
                    </div>
                    <Award className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Study Hours</span>
                        <span>12h</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: "70%" }}
                        ></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Group Participation</span>
                        <span>85%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: "85%" }}
                        ></div>
                      </div>
                    </div>
                  </div>
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

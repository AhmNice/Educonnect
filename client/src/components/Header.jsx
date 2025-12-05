import React, { useState } from "react";
import {
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Menu,
  ChevronDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Header = ({ onMenuToggle, user }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { logoutUser } = useAuthStore();
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    setIsLoggingOut(true);
    try {
      const { success } = await logoutUser();
      // Navigate to login page after successful logout
      if (!success) {
        return;
      }
      navigate("/login", {
        replace: true,
        state: { message: "You have been successfully logged out" },
      });
    } catch (error) {
      console.error("Logout failed:", error);
      // You can show a toast notification here
    } finally {
      setIsLoggingOut(false);
    }
  };
  const userData = user;
  const navigate = useNavigate();
  const notifications = [
    {
      id: 1,
      text: "New message from Study Group",
      time: "5 min ago",
      read: false,
    },
    { id: 2, text: "Assignment due tomorrow", time: "1 hour ago", read: false },
    { id: 3, text: "New resource shared", time: "2 hours ago", read: true },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;
  const avatarPlaceholder = () => {
    if (!user?.full_name) return "";

    return user.full_name
      .split(" ")
      .map((word) => word[0].toUpperCase()) // take first letter
      .join(""); // combine letters
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 w-full top-0 z-40">
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left Section - Menu Toggle */}
        <div className="flex items-center">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 mr-4"
          >
            <Menu className="w-5 h-5 text-gray-600" />
          </button>

          {/* Search Bar
          <div className="relative hidden md:block">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-64 text-sm transition-all duration-200"
              placeholder="Search courses, groups, resources..."
            />
          </div> */}
        </div>

        {/* Right Section - User & Notifications */}
        <div className="flex items-center space-x-4">
          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userData.avatar || avatarPlaceholder()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-900">
                  {userData.full_name}
                </p>
                <p className="text-xs text-gray-500">{userData.role}</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                  isProfileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                {/* User Info */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {userData.avatar}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {userData.name}
                      </p>
                      <p className="text-sm text-gray-500">{userData.email}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={() => {
                      navigate("/profile");
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <User className="w-4 h-4" />
                    <span>My Profile</span>
                  </button>
                  <button
                    onClick={() => {
                      navigate("/settings");
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Settings</span>
                  </button>
                </div>

                {/* Logout */}
                <div className="border-t border-gray-100 pt-2">
                  <button
                    onClick={() => handleLogout()}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Overlay for dropdowns */}
      {(isProfileOpen || isNotificationsOpen) && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => {
            setIsProfileOpen(false);
            setIsNotificationsOpen(false);
          }}
        />
      )}
    </header>
  );
};

export default Header;

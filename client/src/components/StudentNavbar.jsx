import {
  Award,
  Bell,
  Book,
  BookOpen,
  Folder,
  GraduationCap,
  Group,
  Home,
  LogOut,
  MessagesSquare,
  Settings,
  Users,
  X,
} from "lucide-react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useCourseStore } from "../store/courseStore";

const StudentNavbar = ({ collapse, isMobile, onClose, user }) => {
  const { logoutUser } = useAuthStore();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { courses } = useCourseStore();
  const avatarPlaceholder = () => {
    if (!user?.full_name) return "U";
    return user.full_name
      .split(" ")
      .map((word) => word[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  };

  const studentNav = [
    { name: "Dashboard", icon: Home, path: "/dashboard" },
    { name: "Courses", icon: Book, path: "/courses" },
    { name: "My Groups", icon: BookOpen, path: "/my-groups" },
    { name: "Study Groups", icon: Group, path: "/groups/public" },
    { name: "Messages", icon: MessagesSquare, path: "/messages" },
    { name: "Resources", icon: Folder, path: "/resources" },
    { name: "Notifications", icon: Bell, path: "/notifications" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

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

  const navItem = (item, index) => (
    <NavLink
      key={index}
      to={item.path}
      onClick={() => isMobile && onClose?.()}
      className={({ isActive }) =>
        `flex items-center ${
          collapse && !isMobile ? "py-2 px-3" : "p-3"
        } rounded-xl transition-all duration-200 group relative ${
          isActive
            ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 border border-indigo-100"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        } ${collapse && !isMobile ? "justify-center" : "gap-3"}`
      }
    >
      <item.icon
        className={`${
          collapse && !isMobile ? "w-5 h-5" : "w-5 h-5"
        } transition-transform group-hover:scale-110`}
      />
      {(!collapse || isMobile) && (
        <span className="font-medium text-sm transition-all duration-200">
          {item.name}
        </span>
      )}

      {/* Tooltip for collapsed state on desktop */}
      {collapse && !isMobile && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
          {item.name}
          {/* Tooltip arrow */}
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
        </div>
      )}
    </NavLink>
  );

  // Custom logout button component
  const LogoutButton = () => (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className={`flex items-center w-full ${
        collapse && !isMobile ? "py-2 px-3 justify-center" : "p-3 gap-3"
      } rounded-xl transition-all duration-200 group ${
        isLoggingOut
          ? "text-gray-400 cursor-not-allowed"
          : "text-gray-600 hover:bg-red-50 hover:text-red-600"
      }`}
    >
      {isLoggingOut ? (
        <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <LogOut
          className={`${
            collapse && !isMobile ? "w-5 h-5" : "w-5 h-5"
          } transition-transform group-hover:scale-110`}
        />
      )}

      {(!collapse || isMobile) && (
        <span className="font-medium text-sm transition-all duration-200">
          {isLoggingOut ? "Logging out..." : "Logout"}
        </span>
      )}

      {/* Tooltip for collapsed state on desktop */}
      {collapse && !isMobile && !isLoggingOut && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
          Logout
          <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-gray-900"></div>
        </div>
      )}
    </button>
  );

  return (
    <div
      className={`
      bg-white h-full flex flex-col border-r border-gray-200 transition-all duration-300
      ${
        isMobile
          ? "fixed inset-y-0 left-0 w-80 z-50 transform transition-transform duration-300 shadow-xl"
          : collapse
          ? "w-20"
          : "w-64"
      }
    `}
    >
      {/* Header */}
      <div
        className={`
        p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50
        ${collapse && !isMobile ? "text-center" : ""}
      `}
      >
        <div
          className={`flex items-center ${
            collapse && !isMobile ? "justify-center" : "justify-between"
          }`}
        >
          {!collapse || isMobile ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  EduConnect
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  Student Portal
                </span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
          )}

          {/* Close button for mobile */}
          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Stats Bar - Only show when expanded or on mobile */}
      {(!collapse || isMobile) && (
        <div className="px-4 py-3 border-b border-gray-200 bg-white">
          <div className="flex items-center justify-between text-xs">
            <div className="text-center">
              <div className="font-bold text-gray-900">
                {courses?.length || 0}
              </div>
              <div className="text-gray-500">Courses</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">2</div>
              <div className="text-gray-500">Groups</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">5</div>
              <div className="text-gray-500">Messages</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <div className="flex-1 flex flex-col p-3 gap-1 overflow-y-auto">
        {/* Main Navigation */}
        <div className={collapse && !isMobile ? "mb-4" : "mb-6"}>
          {(!collapse || isMobile) && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Navigation
            </h3>
          )}
          {collapse && !isMobile && <div className="h-2"></div>}
          {studentNav.slice(0, 6).map((item, index) => navItem(item, index))}
        </div>

        {/* Communication */}
        <div className={collapse && !isMobile ? "mb-4" : "mb-6"}>
          {(!collapse || isMobile) && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Communication
            </h3>
          )}
          {collapse && !isMobile && <div className="h-2"></div>}
          {studentNav
            .slice(6, 7)
            .map((item, index) => navItem(item, index + 6))}
        </div>
      </div>

      {/* Bottom Section (Settings & Logout) */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <div onClick={() => isMobile && onClose?.()} className="w-full">
          {/* Settings */}
          <div className="mb-1">{navItem(studentNav[7], 7)}</div>

          {/* Logout Button */}
          <LogoutButton />
        </div>

        {/* User Info Footer - Only show when expanded or on mobile */}
        {(!collapse || isMobile) && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {avatarPlaceholder()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name || "Student"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.department || "University"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentNavbar;

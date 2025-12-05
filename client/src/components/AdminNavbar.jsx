import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  User,
  Building,
  Book,
  Users,
  MessageSquare,
  Folder,
  AlertTriangle,
  BarChart2,
  Settings,
  LogOut,
  Shield,
  X,
} from "lucide-react";
import { useAuthStore } from "../store/authStore";

const AdminNavbar = ({ collapse, isMobile, onClose, user }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { logoutUser } = useAuthStore();

  const adminNav = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Users", icon: User, path: "/admin/users" },
    { name: "Universities", icon: Building, path: "/admin/universities" },
    { name: "Courses", icon: Book, path: "/admin/courses" },
    { name: "Study Groups", icon: Users, path: "/admin/groups" },
    { name: "Resources", icon: Folder, path: "/admin/resources" },
    { name: "Reports", icon: AlertTriangle, path: "/admin/reports" },
    { name: "Logs", icon: BarChart2, path: "/admin/logs" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const avatarPlaceholder = () => {
    if (!user?.full_name) return "A";
    return user.full_name
      .split(" ")
      .map((word) => word[0]?.toUpperCase() || "")
      .join("")
      .slice(0, 2);
  };

  const handleLogout = async () => {
    if (isLoggingOut) return; // Prevent multiple clicks

    setIsLoggingOut(true);
    try {
      await logoutUser();
      // Navigate to login page after successful logout
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
            ? "bg-gradient-to-r from-red-50 to-orange-50 text-red-600 border border-red-100"
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
      {/* Admin Header */}
      <div
        className={`
        p-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50
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
              <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                  Admin Panel
                </span>
                <span className="text-xs text-gray-600 font-medium">
                  EduConnect System
                </span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl flex items-center justify-center shadow-lg mx-auto">
              <Shield className="w-5 h-5 text-white" />
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
              <div className="font-bold text-gray-900">1.2K</div>
              <div className="text-gray-500">Users</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">45</div>
              <div className="text-gray-500">Groups</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-gray-900">23</div>
              <div className="text-gray-500">Reports</div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Sections */}
      <div className="flex-1 flex flex-col p-3 gap-1 overflow-y-auto">
        {/* Core Management */}
        <div className={collapse && !isMobile ? "mb-4" : "mb-6"}>
          {(!collapse || isMobile) && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Management
            </h3>
          )}
          {collapse && !isMobile && <div className="h-2"></div>}
          {adminNav.slice(0, 4).map((item, index) => navItem(item, index))}
        </div>

        {/* Content & Monitoring */}
        <div className={collapse && !isMobile ? "mb-4" : "mb-6"}>
          {(!collapse || isMobile) && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
              Monitoring
            </h3>
          )}
          {collapse && !isMobile && <div className="h-2"></div>}
          {adminNav.slice(4, 8).map((item, index) => navItem(item, index + 4))}
        </div>

        {/* Analytics & Settings */}
        <div className={collapse && !isMobile ? "mb-4" : "mb-6"}>
          {(!collapse || isMobile) && (
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 px-1">
              System
            </h3>
          )}
          {collapse && !isMobile && <div className="h-2"></div>}
          {adminNav.slice(8, 10).map((item, index) => navItem(item, index + 8))}
        </div>
      </div>

      {/* Logout Section */}
      <div className="border-t border-gray-200 p-3 bg-gray-50">
        <div onClick={() => isMobile && onClose?.()} className="w-full">
          {/* Logout Button */}
          <LogoutButton />
        </div>

        {/* Admin Info Footer - Only show when expanded or on mobile */}
        {(!collapse || isMobile) && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {avatarPlaceholder()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.full_name || "Administrator"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.role ? user.role.toUpperCase() : "ADMIN"}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
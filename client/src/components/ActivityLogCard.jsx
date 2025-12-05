import React from "react";
import {
  User,
  LogOut,
  LogIn,
  Edit,
  Trash2,
  Eye,
  Download,
  Upload,
  BookOpen,
  Users,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  XCircle,
} from "lucide-react";

const ActivityLogCard = ({ activity }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };
  const formatDate = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };



  const getActivityIcon = (type) => {
    switch (type) {
      case "login":
        return { icon: LogIn, color: "text-green-500", bg: "bg-green-50" };
      case "logout":
        return { icon: LogOut, color: "text-red-500", bg: "bg-red-50" };
      case "create":
      case "add":
        return { icon: Plus, color: "text-blue-500", bg: "bg-blue-50" };
      case "update":
      case "edit":
        return { icon: Edit, color: "text-yellow-500", bg: "bg-yellow-50" };
      case "delete":
      case "remove":
        return { icon: Trash2, color: "text-red-500", bg: "bg-red-50" };
      case "view":
      case "read":
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
        return { icon: MessageSquare, color: "text-teal-500", bg: "bg-teal-50" };
      case "success":
        return { icon: CheckCircle, color: "text-green-500", bg: "bg-green-50" };
      case "error":
      case "warning":
        return { icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" };
      default:
        return { icon: User, color: "text-gray-500", bg: "bg-gray-50" };
    }
  };

  const getActivityTypeText = (type) => {
    return type
      ?.split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const activityInfo = getActivityIcon(activity.activity_type);
  const ActivityIcon = activityInfo.icon;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className={`${activityInfo.bg} p-2 rounded-lg flex-shrink-0`}>
          <ActivityIcon className={`w-5 h-5 ${activityInfo.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                {activity.description || "Activity performed"}
              </h3>
              <div className="flex items-center mt-1 space-x-2">
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {getActivityTypeText(activity.activity_type)}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">
                  by {activity.user || "Unknown User"}
                </span>
              </div>
            </div>

            {/* Time */}
            <div className="flex flex-col items-end text-right flex-shrink-0 ml-2">
              <div className="flex items-center text-xs text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                {formatTime(activity.timestamp)}
              </div>
              <div className="flex items-center text-xs text-gray-400 mt-1">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(activity.timestamp)}
              </div>
            </div>
          </div>

          {/* Optional additional details */}
          {activity.details && (
            <p className="text-sm text-gray-600 mt-2">
              {activity.details}
            </p>
          )}

          {/* Footer - Activity ID (optional) */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-400">
              ID: {activity.activity_id?.slice(-8) || "N/A"}
            </div>
            {activity.ip_address && (
              <div className="text-xs text-gray-400">
                IP: {activity.ip_address}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Compact version for lists
export const CompactActivityCard = ({ activity }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "login": return { icon: LogIn, color: "text-green-500" };
      case "logout": return { icon: LogOut, color: "text-red-500" };
      case "create": return { icon: Plus, color: "text-blue-500" };
      case "update": return { icon: Edit, color: "text-yellow-500" };
      case "delete": return { icon: Trash2, color: "text-red-500" };
      default: return { icon: User, color: "text-gray-500" };
    }
  };

  const activityInfo = getActivityIcon(activity.activity_type);
  const ActivityIcon = activityInfo.icon;

  return (
    <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors">
      <div className={`${activityInfo.color} p-2 rounded-full bg-gray-100`}>
        <ActivityIcon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900 truncate">
          {activity.description}
        </p>
        <div className="flex items-center text-xs text-gray-500 mt-1">
          <span className="truncate">{activity.user}</span>
          <span className="mx-1">•</span>
          <span>{formatTime(activity.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

// Timeline version
export const TimelineActivityCard = ({ activity, isLast = false }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "login": return { icon: LogIn, color: "text-green-500", bg: "bg-green-100" };
      case "logout": return { icon: LogOut, color: "text-red-500", bg: "bg-red-100" };
      case "create": return { icon: Plus, color: "text-blue-500", bg: "bg-blue-100" };
      case "update": return { icon: Edit, color: "text-yellow-500", bg: "bg-yellow-100" };
      case "delete": return { icon: Trash2, color: "text-red-500", bg: "bg-red-100" };
      default: return { icon: User, color: "text-gray-500", bg: "bg-gray-100" };
    }
  };

  const activityInfo = getActivityIcon(activity.activity_type);
  const ActivityIcon = activityInfo.icon;

  return (
    <div className="flex">
      {/* Timeline line */}
      <div className="flex flex-col items-center mr-4">
        <div className={`${activityInfo.bg} p-2 rounded-full z-10`}>
          <ActivityIcon className={`w-4 h-4 ${activityInfo.color}`} />
        </div>
        {!isLast && (
          <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-4">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-medium text-gray-900">
            {activity.description}
          </p>
          <span className="text-xs text-gray-500">
            {formatTime(activity.timestamp)}
          </span>
        </div>
        <p className="text-xs text-gray-600">
          by {activity.user}
        </p>
        {activity.details && (
          <p className="text-xs text-gray-500 mt-1">
            {activity.details}
          </p>
        )}
      </div>
    </div>
  );
};

export default ActivityLogCard;
import React from "react";
import { Users, MessageCircle, CheckCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { socketHandlers } from "../../utils/socketHandlers";

const ChatCard = ({ chat, isActive = false,  }) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const handleClick = () => {
    navigate(`/messages?chat_id=${chat.conversation_id}`);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return;
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (diffInHours < 48) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" });
    }
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-indigo-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div
      onClick={handleClick}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
        isActive ? "bg-indigo-50 border-indigo-200" : "bg-white"
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm ${getAvatarColor(
              chat.group_name
            )}`}
          >
            {chat.type === "group" ? (
              <Users className="w-5 h-5" />
            ) : (
              <span>{getInitials(chat.group_name)}</span>
            )}
          </div>
          {/* Online Indicator */}
          {chat.isOnline && chat.type === "direct" && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          )}
        </div>

        {/* Chat Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={`font-semibold truncate ${
                isActive ? "text-indigo-700" : "text-gray-900"
              }`}
            >
              {chat.group_name}
            </h3>
            <span className="text-xs text-gray-500 flex-shrink-0 ml-2">
              {formatTime(chat.last_message_time)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <p
              className={`text-sm truncate ${
                isActive ? "text-indigo-600" : "text-gray-600"
              } ${chat.unread_count > 0 ? "font-medium" : ""}`}
            >
              {chat.last_message || "No message yet"}
            </p>

            {/* Message Status */}
            <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
              {chat.unread_count > 0 ? (
                <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                  {chat.unread_count}
                </span>
              ) : chat.last_message_sender &&
                chat.last_message_sender !== user.user_id ? (
                <CheckCheck className="w-4 h-4 text-gray-400" />
              ) : null}
            </div>
          </div>

          {/* Group Info */}
          {chat.conversation_type === "group" && (
            <div className="flex items-center space-x-1 mt-1">
              <Users className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500">
                {chat?.conversation_members?.length} members
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatCard;

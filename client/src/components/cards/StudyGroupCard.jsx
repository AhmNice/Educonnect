// components/cards/StudyGroupCard.jsx
import React from "react";
import { Users, Calendar, Eye, BookOpen, Settings, Lock } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const StudyGroupCard = ({ group, viewMode = "grid", setRequest }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  // Check if current user is the creator of this group
  const isCreator = user?.user_id === group?.creator?.user_id;
  const isPublic = group?.visibility === "public";
  const isMember = group?.members && group.members.includes(user.user_id);
  // Determine button text based on user role and context
  const getButtonText = () => {
    if (isPublic) {
      return isCreator
        ? "Manage Group"
        : isMember
        ? "View Group"
        : "Join Group";
    }
    return isCreator
      ? "Manage Group"
      : isMember
      ? "View Group"
      : "Request to join Group";
  };

  // Handle button click action
  const handleButtonClick = (e) => {
    e.stopPropagation();
    if (isCreator) {
      navigate(`/my-groups/manage/${group.group_id}`);
    } else if (isPublic) {
      console.log("Join group:", group.group_id);
    } else {
      if (isMember) {
        navigate(`/messages?chat_id=${group.conversation_id}`);
        return;
      }
      setRequest();
    }
  };

  if (viewMode === "list") {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start space-x-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {group.group_name}
                    </h3>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{group.course}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{group.member_count} members</span>
                    </span>
                    <div className="flex flex-col">
                      {isPublic && (
                        <span className="flex items-center space-x-1 text-indigo-600">
                          <Eye className="w-4 h-4" />
                          <span>Public</span>
                        </span>
                      )}
                      {!isPublic && (
                        <span className="flex items-center space-x-1 text-indigo-600">
                          <Lock className="w-4 h-4" />
                          <span>Private</span>
                        </span>
                      )}
                      {isCreator && (
                        <span className="flex items-center space-x-1 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-lg">
                          <Settings className="w-3 h-3" />
                          <span>Owner</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="text-gray-600 mb-4 line-clamp-2">
              {group.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {group.tags?.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
                >
                  {tag}
                </span>
              ))}
            </div>
            {group.meeting_schedule && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>{group.meeting_schedule}</span>
              </div>
            )}
          </div>
          <div className="mt-4 lg:mt-0 lg:ml-6 flex space-x-3">
            <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors">
              View Details
            </button>
            <button
              onClick={handleButtonClick}
              className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                isCreator
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
              }`}
            >
              {getButtonText()}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {group.group_name}
            </h3>
          </div>
          <p className="text-sm text-gray-600 flex items-center space-x-1">
            <BookOpen className="w-4 h-4" />
            <span>{group.course}</span>
          </p>
        </div>
        <div className="flex flex-col gap-2">
          {isPublic && (
            <span className="flex items-center space-x-1 text-indigo-600 text-sm bg-indigo-50 px-2 py-1 rounded-lg ml-2 flex-shrink-0">
              <Eye className="w-3 h-3" />
              <span>Public</span>
            </span>
          )}
          {!isPublic && (
            <span className="flex items-center space-x-1 text-indigo-600 text-sm bg-indigo-50 px-2 py-1 rounded-lg ml-2 flex-shrink-0">
              <Lock className="w-3 h-3" />
              <span>Private</span>
            </span>
          )}
          {isCreator && (
            <span className="flex items-center space-x-1 text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded-lg flex-shrink-0">
              <Settings className="w-3 h-3" />
              <span>Owner</span>
            </span>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {group.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 mb-4">
        {group.tags?.slice(0, 3).map((tag, index) => (
          <span
            key={index}
            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg"
          >
            {tag}
          </span>
        ))}
        {group.tags?.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg">
            +{group.tags.length - 3}
          </span>
        )}
      </div>

      {/* Stats and Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>
              {group.member_count}
              {group.max_members > 0 && ` / ${group.max_members}`} members
            </span>
          </span>
          <span
            className={`px-2 py-1 rounded-lg text-xs ${
              group.status === "active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {group.status}
          </span>
        </div>

        {group.meeting_schedule && (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="truncate">{group.meeting_schedule}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <button
        onClick={handleButtonClick}
        className={`w-full mt-4 cursor-pointer py-2.5 px-4 rounded-xl font-semibold transition-all duration-200 text-sm ${
          isCreator
            ? "bg-blue-600 text-white hover:bg-blue-700"
            : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700"
        }`}
      >
        {getButtonText()}
      </button>
    </div>
  );
};

export default StudyGroupCard;

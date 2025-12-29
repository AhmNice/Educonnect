import React from "react";
import {
  X,
  Users,
  Calendar,
  BookOpen,
  Lock,
  Globe,
  Loader2,
  AlertCircle,
  UserLock,
} from "lucide-react";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../lib/axios";
import { useAuthStore } from "../../store/authStore";

const JoinGroupModal = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [groupDetails, setGroupDetails] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const token = params.get("token");
  const group_id = params.get("group_id");
  const { user } = useAuthStore();
  if (!token || !group_id) {
    toast.error("Invalid invitation link");
    // navigate("/groups/public");
    return null;
  }
  useEffect(() => {
    const fetchGroupDetails = async () => {
      setIsLoading(true);
      try {
        const { data } = await api.get(`/group/get-group-info/${group_id}`);
        setGroupDetails(data.group);
        setIsLoading(false);
      } catch (error) {
        console.error("❌ Error fetching group details:", error);
        toast.error(
          "Failed to fetch group details. The invitation link may be invalid or expired."
        );
        setIsLoading(false);
        setError(error);
      }
    };
    fetchGroupDetails();
  }, []);

  if (!isOpen) return null;

  const handleJoin = async () => {
    try {
      const { data } = await api.post(
        `/group/join-group-by-invite/${group_id}?token=${token}&user_id=${user.user_id}`
      );
      if (!data.success) {
        toast.error(data.reason || "Failed to join the group.");
        setIsLoading(false);
        return;
      }
      toast.success(data.message || "Successfully joined the group!");
      setIsLoading(false);
      navigate(`/messages?chat_id=${data.group.conversation_id}`);
    } catch (error) {
      console.error("❌ Error fetching group details:", error);
      const errMsg = error.response?.data?.message;
      toast.error(
        errMsg ||
          "Failed to fetch group details. The invitation link may be invalid or expired."
      );
      setIsLoading(false);
      // setError(error);
      // navigate("/groups/public");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  if (error) {
    return (
      <div
        className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/50 z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full mx-4 p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Oops!</h3>
          <p className="text-gray-600 mb-4">
            {error.message || "Something went wrong. Please try again."}
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
  if (isLoading) {
    return (
      <div
        className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/50 z-50 p-4"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 p-8 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-900">
            Loading Group Details
          </h3>
          <p className="text-gray-600 text-center text-sm">
            Please wait while we fetch the group information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/50 z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-hidden animate-in fade-in-90 zoom-in-90">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Join Study Group</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Group Name */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {groupDetails?.group_name}
          </h3>

          {/* Course */}
          <div className="flex items-center gap-2 text-gray-600 mb-4">
            <BookOpen className="w-4 h-4" />
            <span className="font-medium">{groupDetails?.course}</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {groupDetails?.description}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Members */}
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {groupDetails?.member_count}/{groupDetails?.max_members}
                </p>
                <p className="text-xs text-gray-500">Members</p>
              </div>
            </div>

            {/* Schedule */}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {groupDetails?.meeting_schedule}
                </p>
                <p className="text-xs text-gray-500">Meets</p>
              </div>
            </div>

            {/* Visibility */}
            <div className="flex items-center gap-2">
              {groupDetails?.visibility === "public" ? (
                <Globe className="w-4 h-4 text-green-500" />
              ) : (
                <Lock className="w-4 h-4 text-amber-500" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-900 capitalize">
                  {groupDetails?.visibility}
                </p>
                <p className="text-xs text-gray-500">Visibility</p>
              </div>
            </div>

            {/* Creator */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 flex items-center justify-center">
                <UserLock className="w-4 h-4 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {groupDetails?.creator.full_name}
                </p>
                <p className="text-xs text-gray-500">Creator</p>
              </div>
            </div>
          </div>

          {/* Tags */}
          {groupDetails?.tags && groupDetails?.tags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
              <div className="flex flex-wrap gap-2">
                {groupDetails?.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Membership Status */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Available Spots</p>
                <p className="text-sm text-blue-700">
                  {groupDetails?.max_members - groupDetails?.member_count} out
                  of {groupDetails?.max_members} spots remaining
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleJoin}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Join Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinGroupModal;

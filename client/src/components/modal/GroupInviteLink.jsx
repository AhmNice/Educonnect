import { Link2, Copy, Check, X, Clock, RefreshCw, Users } from "lucide-react";
import React, { useState, useEffect } from "react";
import api from "../../lib/axios";
import { toast } from "react-toastify";

const GroupInviteLink = ({ group_id, user_id, onClose}) => {
  const [group_link, setGroupLink] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [remainingTime, setRemainingTime] = useState("");

  // Fetch initial group link on mount
  const getGroupLink = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await api.get(
        `/group/get-group-link/${group_id}/${user_id}`
      );
      if (!data.success) {
        setError(data.message || "Failed to generate link");
        toast.error(data.message || "Failed to generate link");
        return;
      }
      setGroupLink(data.InvitationLink);
      setExpiresAt(data.expires_at);
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to generate invitation link";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user_id || !group_id) {
      toast.error("Missing required variables (Mocked to be available)");
      return;
    }
    getGroupLink();
  }, [group_id, user_id, toast]);

  // Real-time countdown timer logic
  useEffect(() => {
    if (!expiresAt) {
      setRemainingTime("");
      return;
    }

    const expiryTime = new Date(expiresAt).getTime();

    const updateRemainingTime = () => {
      // Use the actual current time (`new Date()`) for the real-time calculation
      const now = new Date().getTime();
      const diff = expiryTime - now;

      if (diff <= 0) {
        setRemainingTime("Expired");
        clearInterval(interval); // Stop the timer when it hits zero
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      // Pad with leading zeros for aesthetics
      const formatTime = (time) => String(time).padStart(2, "0");

      setRemainingTime(
        `${formatTime(hours)}h ${formatTime(minutes)}m ${formatTime(seconds)}s`
      );
    };

    // Call once immediately, then set interval
    updateRemainingTime();
    const interval = setInterval(updateRemainingTime, 1000);

    // Cleanup interval on unmount or when expiresAt changes
    return () => clearInterval(interval);
  }, [expiresAt]);

  const generateNewLink = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const { data } = await api.post("/group/generate-new-link", {
        group_id,
        user_id,
      });
      if (!data.success) {
        setError(data.message || "Failed to generate new link");
        toast.error(data.message || "Failed to generate new link");
        return;
      }
      setGroupLink(data.InvitationLink);
      setExpiresAt(data.expires_at);
      setCopied(false);
      toast.success("New invitation link generated!");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message || "Failed to generate new link";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!group_link) return;

    try {
      // Using document.execCommand('copy') for better compatibility in sandboxed environments
      const tempInput = document.createElement("textarea");
      tempInput.value = group_link;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand("copy");
      document.body.removeChild(tempInput);

      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      setError("Failed to copy to clipboard");
      toast.error("Failed to copy to clipboard");
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const isExpired =
    expiresAt && new Date(expiresAt).getTime() <= new Date().getTime();

  // Show error modal if missing required props
  if (!user_id || !group_id) {
    return (
      <div
        className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50 p-4 font-inter"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
          <div className="p-6 text-center">
            <div className="text-red-500 mb-4">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Missing Information
            </h3>
            <p className="text-gray-600 mb-4">
              Unable to generate invitation link due to missing information.
            </p>
            <button
              onClick={onClose}
              className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors shadow-md"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 w-full h-full bg-black/50 flex items-center justify-center z-50 p-4 font-inter"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl transition-all duration-300 transform scale-100 hover:scale-[1.01]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Users className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                Invite to Group
              </h2>
              <p className="text-sm text-gray-500">
                Share this link to invite members
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info Text */}
          <div
            className={`border rounded-xl p-4 transition-all duration-300 ${
              isExpired
                ? "bg-red-50 border-red-200"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <div className="flex items-start space-x-3">
              <Clock
                className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                  isExpired ? "text-red-600" : "text-blue-500"
                }`}
              />
              <div className="text-sm">
                <p
                  className={`font-semibold mb-1 ${
                    isExpired ? "text-red-800" : "text-blue-800"
                  }`}
                >
                  {isExpired ? "Link Expired" : "Invitation Details"}
                </p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Link expires in 48 hours</li>
                  <li>• Can be used to invite one user</li>
                  <li>• A new link can be generated at any time</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2 text-indigo-600">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="font-medium">Fetching invitation link...</span>
              </div>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="bg-red-50 border border-red-300 rounded-xl p-4 space-y-3">
              <div className="flex items-center space-x-2 justify-center">
                <X className="w-5 h-5 text-red-600" />
                <p className="text-sm text-red-700 text-center font-medium">
                  {error}
                </p>
              </div>
              <button
                onClick={getGroupLink}
                className="w-full bg-red-600 text-white py-2 rounded-xl font-medium hover:bg-red-700 transition-colors text-sm shadow-md"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Link Display */}
          {group_link && !isLoading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-semibold text-gray-700">
                  Invitation Link
                </label>
                {expiresAt && (
                  <div className="flex items-center space-x-1 text-sm">
                    <Clock
                      className={`w-4 h-4 ${
                        isExpired ? "text-red-500" : "text-green-500"
                      }`}
                    />
                    <span
                      className={`font-bold ${
                        isExpired ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {isExpired ? "EXPIRED" : remainingTime}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <div className="flex-1 relative">
                  <Link2 className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={group_link}
                    readOnly
                    title={group_link}
                    className={`w-full pl-10 pr-4 py-3 bg-gray-100 border rounded-xl text-sm font-mono truncate focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all ${
                      isExpired
                        ? "border-red-300 text-red-600"
                        : "border-gray-300 text-gray-800"
                    }`}
                    onClick={(e) => e.target.select()}
                  />
                </div>
                <button
                  onClick={copyToClipboard}
                  disabled={isExpired}
                  className={`p-3 rounded-xl border transition-all duration-200 flex-shrink-0 shadow-sm ${
                    isExpired
                      ? "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                      : copied
                      ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                      : "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-700 hover:border-indigo-700"
                  }`}
                  title={isExpired ? "Link expired" : "Copy to clipboard"}
                >
                  {copied ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <Copy className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-3 rounded-xl font-semibold cursor-pointer hover:bg-gray-200 transition-all duration-200 border border-gray-300 shadow-sm"
            >
              Close
            </button>
            <button
              onClick={generateNewLink}
              disabled={isGenerating || isLoading}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-3 cursor-pointer rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg transform hover:scale-[1.02] flex items-center justify-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>Generate New Link</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupInviteLink;

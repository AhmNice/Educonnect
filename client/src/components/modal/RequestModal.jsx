import React, { useState } from "react";
import { X, Send, MessageCircle } from "lucide-react";
import { useRequestStore } from "../../store/requestStore";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";

const RequestModal = ({ isOpen, onClose, group }) => {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { sendGroupRequest } = useRequestStore();
  const {user} = useAuthStore()

  if (!isOpen) return null;
console.log(group.group_id)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    if(!group){
      toast.info("no group selected")
      return
    }
    const payload={
      user_id:user.user_id,
      group_id:group.group_id,
      message
    }
    setIsSubmitting(true);
    try {
      await sendGroupRequest(payload)
      setMessage("");
      onClose();
    } catch (error) {
      console.error("Error submitting request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md transform transition-all">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <MessageCircle className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Join Group Request
              </h2>
              <p className="text-sm text-gray-600">
                Request to join {group.group_name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="request_message"
              className="block text-sm font-medium text-gray-700"
            >
              Message (optional)
            </label>
            <textarea
              id="request_message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the group admin why you'd like to join..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-colors"
            />
            <p className="text-xs text-gray-500">
              Briefly introduce yourself and your interest in the group
            </p>
          </div>

          {/* Character count */}
          <div className="flex justify-between items-center text-sm text-gray-500">
            <span>{message.length}/500 characters</span>
            <span className={message.length > 500 ? "text-red-500" : ""}>
              {message.length > 500 ? "Message too long" : ""}
            </span>
          </div>
        </form>

        {/* Footer */}
        <div className="flex space-x-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || message.length > 500}
            className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Send Request</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestModal;

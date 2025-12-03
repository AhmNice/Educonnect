import React, { useEffect } from "react";
import { Users, Check, X, Calendar, Eye, Clock, Building } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useRequestStore } from "../../../store/requestStore";
import { useAuthStore } from "../../../store/authStore";

const RequestTab = ({ group }) => {
  const { user } = useAuthStore();
  const { approveGroupRequest, approveAllGroupRequest, rejectAllGroupRequest } =
    useRequestStore();
  const handleApproveRequest = async (requestId) => {
    setIsProcessingRequest(true);
    try {
      const payload = {
        request_id: requestId,
        admin_id: user.user_id,
      };
      await approveGroupRequest(payload);
      await fetchAllGroupRequest(group.group_id);
      // toast.success("Request approved successfully!");
    } catch (error) {
      toast.error("Failed to approve request");
    } finally {
      setIsProcessingRequest(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setIsProcessingRequest(true);
    try {
      const payload = {
        request_id: requestId,
        admin_id: user.user_id,
      };
      // TODO: Replace with actual API call
      // await api.patch(`/groups/${group_id}/requests/${requestId}`, { status: 'rejected' });
      await fetchAllGroupRequest(group.group_id);

      toast.success("Request rejected successfully!");
    } catch (error) {
      toast.error("Failed to reject request");
    } finally {
      setIsProcessingRequest(false);
    }
  };

  const handleApproveAllRequests = async () => {
    setIsProcessingRequest(true);
    try {
      const payload = {
        group_id: group.group_id,
        admin_id: user.user_id,
      };

      await approveAllGroupRequest(payload);
      await fetchAllGroupRequest(group.group_id);
    } catch (error) {
      toast.error("Failed to approve all requests");
    } finally {
      setIsProcessingRequest(false);
    }
  };

  const handleRejectAllRequests = async () => {
    setIsProcessingRequest(true);
    try {
      const payload = {
        group_id: group.group_id,
        admin_id: user.user_id,
      };

      await rejectAllGroupRequest(payload);
      await fetchAllGroupRequest(group.group_id);
    } catch (error) {
      toast.error("Failed to reject all requests");
    } finally {
      setIsProcessingRequest(false);
    }
  };

  const handleViewProfile = (userId) => {
    // Navigate to user profile or open profile modal
    console.log("View profile:", userId);
  };

  const [requestFilter, setRequestFilter] = useState("pending");
  const [isProcessingRequest, setIsProcessingRequest] = useState(false);
  const { fetchAllGroupRequest, allGroupRequests } = useRequestStore();
  // Mock data for requests (replace with actual API calls)
  useEffect(() => {
    const fetchGroupRequest = async () => {
      await fetchAllGroupRequest(group.group_id);
    };
    fetchGroupRequest();
  }, [group]);

  // Filter requests based on current filter
  const allRequests = allGroupRequests; // Replace with actual data
  const pendingRequests = allRequests.filter((req) => req.status === "pending");
  const approvedRequests = allRequests.filter(
    (req) => req.status === "approved"
  );
  const rejectedRequests = allRequests.filter(
    (req) => req.status === "rejected"
  );
  const filteredRequests =
    requestFilter === "pending"
      ? pendingRequests
      : requestFilter === "approved"
      ? approvedRequests
      : requestFilter === "rejected"
      ? rejectedRequests
      : allRequests;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Join Requests</h3>
          <p className="text-gray-600">
            Manage requests to join your study group
          </p>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="bg-blue-100 text-blue-800 px-2.5 py-1 rounded-full font-medium">
            {pendingRequests.length} Pending
          </span>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {pendingRequests.length}
              </p>
              <p className="text-sm text-gray-600">Pending</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Check className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {approvedRequests.length}
              </p>
              <p className="text-sm text-gray-600">Approved</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {rejectedRequests.length}
              </p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Clock className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {allRequests.length}
              </p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              {
                key: "pending",
                label: "Pending",
                count: pendingRequests.length,
              },
              {
                key: "approved",
                label: "Approved",
                count: approvedRequests.length,
              },
              {
                key: "rejected",
                label: "Rejected",
                count: rejectedRequests.length,
              },
              {
                key: "all",
                label: "All Requests",
                count: allRequests.length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setRequestFilter(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  requestFilter === tab.key
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span
                    className={`ml-2 py-0.5 px-2 text-xs rounded-full ${
                      requestFilter === tab.key
                        ? "bg-indigo-100 text-indigo-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Requests List */}
        <div className="p-6">
          {filteredRequests.length > 0 ? (
            <div className="space-y-4">
              {filteredRequests.map((request) => (
                <div
                  key={request.request_id}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-indigo-600" />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {request.user.full_name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {request.user.email}
                        </p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="flex items-center space-x-1 text-xs text-gray-500">
                            <Building className="w-3 h-3" />
                            <span>{request.user.university}</span>
                          </span>
                          <span className="flex items-center space-x-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            <span>
                              Requested{" "}
                              {formatDistanceToNow(
                                new Date(request.requested_at)
                              )}{" "}
                              ago
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      {/* Request Status Badge */}
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "approved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status === "pending" && (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {request.status === "approved" && (
                          <Check className="w-3 h-3 mr-1" />
                        )}
                        {request.status === "rejected" && (
                          <X className="w-3 h-3 mr-1" />
                        )}
                        {request.status.charAt(0).toUpperCase() +
                          request.status.slice(1)}
                      </span>

                      {/* Action Buttons for Pending Requests */}
                      {request.status === "pending" && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              handleApproveRequest(request.request_id)
                            }
                            disabled={isProcessingRequest}
                            className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
                          >
                            <Check className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() =>
                              handleRejectRequest(request.request_id)
                            }
                            disabled={isProcessingRequest}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1 text-sm"
                          >
                            <X className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      )}

                      {/* View Profile Button */}
                      <button
                        onClick={() => handleViewProfile(request.user.user_id)}
                        className="text-indigo-600 hover:text-indigo-700 font-medium text-sm flex items-center space-x-1"
                      >
                        <Eye className="w-4 h-4" />
                        <span>Profile</span>
                      </button>
                    </div>
                  </div>

                  {/* Message from User (if any) */}
                  {request.message && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Message: </span>
                        {request.message}
                      </p>
                    </div>
                  )}

                  {/* Action History for Non-Pending Requests */}
                  {request.status !== "pending" && request.processed_by && (
                    <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
                      <span>
                        {request.status === "approved"
                          ? "Approved"
                          : "Rejected"}{" "}
                        by {request.processed_by.full_name}
                      </span>
                      <span>
                        {formatDistanceToNow(new Date(request.processed_at))}{" "}
                        ago
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                {requestFilter === "pending"
                  ? "No Pending Requests"
                  : requestFilter === "approved"
                  ? "No Approved Requests"
                  : requestFilter === "rejected"
                  ? "No Rejected Requests"
                  : "No Requests Found"}
              </h4>
              <p className="text-gray-600 max-w-md mx-auto">
                {requestFilter === "pending"
                  ? "When users request to join your group, their requests will appear here for review."
                  : "No requests match the current filter."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Bulk Actions for Pending Requests */}
      {pendingRequests.length > 0 && requestFilter === "pending" && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium text-blue-900">Bulk Actions</h4>
              <p className="text-sm text-blue-700">
                Quickly manage multiple requests at once
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleApproveAllRequests}
                disabled={isProcessingRequest}
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <Check className="w-4 h-4" />
                <span>Approve All</span>
              </button>
              <button
                onClick={handleRejectAllRequests}
                disabled={isProcessingRequest}
                className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <X className="w-4 h-4" />
                <span>Reject All</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestTab;

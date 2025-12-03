import React from "react";
import {
  Users,
  Trash2,
  Eye,
  EyeOff,

} from "lucide-react";
const SettingsTab = ({ group }) => {
  const handleUpdateVisibility = async (visibility) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.patch(`/groups/${group_id}`, { visibility });

      // Update local state immediately for better UX
      setGroup((prev) => ({ ...prev, visibility }));
      toast.success(`Group visibility updated to ${visibility}`);
    } catch (error) {
      toast.error("Failed to update visibility");
      console.error("Error updating visibility:", error);
    }
  };

  const handleUpdateStatus = async (status) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.patch(`/groups/${group_id}`, { status });

      setGroup((prev) => ({ ...prev, status }));
      toast.success(`Group status updated to ${status}`);
    } catch (error) {
      toast.error("Failed to update status");
      console.error("Error updating status:", error);
    }
  };

  const handleUpdateMaxMembers = async (max_members) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.patch(`/groups/${group_id}`, { max_members });

      setGroup((prev) => ({ ...prev, max_members }));
      toast.success(`Maximum members updated to ${max_members}`);
    } catch (error) {
      toast.error("Failed to update member limit");
      console.error("Error updating max members:", error);
    }
  };

  const handleToggleJoinApproval = async () => {
    try {
      const newValue = !group.requires_approval;
      // TODO: Replace with actual API call
      // const response = await api.patch(`/groups/${group_id}`, { requires_approval: newValue });

      setGroup((prev) => ({ ...prev, requires_approval: newValue }));
      toast.success(`Join approval ${newValue ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update join approval setting");
      console.error("Error updating join approval:", error);
    }
  };
   const handleDeleteGroup = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete this group? This action cannot be undone."
      )
    ) {
      try {
        // TODO: Replace with actual API call
        // await axios.delete(`/api/groups/${groupId}`);
        console.log("Group deleted:", group.group_id);
        navigate("/my-groups");
      } catch (error) {
        console.error("Error deleting group:", error);
      }
    }
  };
  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-900">Group Settings</h3>

      {/* Visibility Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Group Visibility
        </h4>
        <p className="text-gray-600 mb-6">
          Control who can see and join your study group.
        </p>

        <div className="space-y-4">
          {/* Public Option */}
          <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="radio"
                id="visibility-public"
                name="visibility"
                value="public"
                checked={group.visibility === "public"}
                onChange={() => handleUpdateVisibility("public")}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="visibility-public"
                className="flex items-center space-x-2 mb-2"
              >
                <Eye className="w-5 h-5 text-green-600" />
                <span className="font-medium text-gray-900">Public Group</span>
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Anyone can find and view this group. Members can join by
                requesting invitation.
              </p>
              <div className="flex items-center space-x-2 text-xs text-green-600">
                <Users className="w-3 h-3" />
                <span>Recommended for larger study groups</span>
              </div>
            </div>
          </div>

          {/* Private Option */}
          <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="radio"
                id="visibility-private"
                name="visibility"
                value="private"
                checked={group.visibility === "private"}
                onChange={() => handleUpdateVisibility("private")}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="visibility-private"
                className="flex items-center space-x-2 mb-2"
              >
                <EyeOff className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-gray-900">Private Group</span>
              </label>
              <p className="text-sm text-gray-600 mb-2">
                Only invited members can join. The group won't appear in public
                searches.
              </p>
              <div className="flex items-center space-x-2 text-xs text-blue-600">
                <Users className="w-3 h-3" />
                <span>Recommended for focused study sessions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Status */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">
                Current Visibility
              </p>
              <p className="text-sm text-gray-600">
                {group.visibility === "public"
                  ? "This group is visible to everyone"
                  : "This group is private and invitation-only"}
              </p>
            </div>
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                group.visibility === "public"
                  ? "bg-green-100 text-green-800"
                  : "bg-blue-100 text-blue-800"
              }`}
            >
              {group.visibility === "public" ? (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Public
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 mr-1" />
                  Private
                </>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Group Status Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Group Status
        </h4>
        <p className="text-gray-600 mb-6">
          Control whether the group is active or paused.
        </p>

        <div className="space-y-4">
          {/* Active Option */}
          <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="radio"
                id="status-active"
                name="status"
                value="active"
                checked={group.status === "active"}
                onChange={() => handleUpdateStatus("active")}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="status-active"
                className="flex items-center space-x-2 mb-2"
              >
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="font-medium text-gray-900">Active</span>
              </label>
              <p className="text-sm text-gray-600">
                Group is active and members can participate in discussions and
                schedule meetings.
              </p>
            </div>
          </div>

          {/* Inactive Option */}
          <div className="flex items-start space-x-4 p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors">
            <div className="flex items-center h-5 mt-0.5">
              <input
                type="radio"
                id="status-inactive"
                name="status"
                value="inactive"
                checked={group.status === "inactive"}
                onChange={() => handleUpdateStatus("inactive")}
                className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
              />
            </div>
            <div className="flex-1">
              <label
                htmlFor="status-inactive"
                className="flex items-center space-x-2 mb-2"
              >
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <span className="font-medium text-gray-900">Paused</span>
              </label>
              <p className="text-sm text-gray-600">
                Group is temporarily inactive. Members can still view content
                but cannot schedule new meetings.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Member Settings */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">
          Member Settings
        </h4>

        <div className="space-y-4">
          {/* Max Members */}
          <div>
            <label
              htmlFor="max_members"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Maximum Members
            </label>
            <div className="flex items-center space-x-3">
              <select
                id="max_members"
                value={group.max_members}
                onChange={(e) =>
                  handleUpdateMaxMembers(parseInt(e.target.value))
                }
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value={0}>No limit</option>
                <option value={5}>5 members</option>
                <option value={10}>10 members</option>
                <option value={15}>15 members</option>
                <option value={20}>20 members</option>
                <option value={25}>25 members</option>
                <option value={30}>30 members</option>
              </select>
              <div className="text-sm text-gray-500">
                Current: {group.current_members} members
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Set a limit to control group size. When reached, new members can
              only join by invitation.
            </p>
          </div>

          {/* Join Request Setting */}
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Require Join Approval</p>
              <p className="text-sm text-gray-600">
                New members must be approved by group admins before joining
              </p>
            </div>
            <button
              onClick={() => handleToggleJoinApproval()}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                group.requires_approval ? "bg-indigo-600" : "bg-gray-200"
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  group.requires_approval ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h4 className="text-sm font-semibold text-red-800 mb-2">Danger Zone</h4>
        <p className="text-red-700 mb-4">
          Once you delete a group, there is no going back. Please be certain.
        </p>
        <button
          onClick={handleDeleteGroup}
          className="bg-red-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete This Group</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsTab;

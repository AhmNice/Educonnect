import React from "react";
import { Users, Trash2, UserPlus } from "lucide-react";
const MemberTab = ({ members,handleShowGroupLink }) => {
  const handleRemoveMember = async (memberId) => {
    if (
      window.confirm(
        "Are you sure you want to remove this member from the group?"
      )
    ) {
      try {
        // TODO: Replace with actual API call
        // await axios.delete(`/api/groups/${groupId}/members/${memberId}`);
        setMembers(members.filter((member) => member.user_id !== memberId));
      } catch (error) {
        console.error("Error removing member:", error);
      }
    }
  };

  const handleChangeRole = async (memberId, newRole) => {
    try {
      // TODO: Replace with actual API call
      // await axios.patch(`/api/groups/${groupId}/members/${memberId}`, { role: newRole });
      setMembers(
        members?.map((member) =>
          member.user_id === memberId ? { ...member, role: newRole } : member
        )
      );
    } catch (error) {
      console.error("Error changing role:", error);
    }
  };

  const handleInviteMember = () => {
    handleShowGroupLink();
  };
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-semibold text-gray-900">Group Members</h3>
        <button
          onClick={handleInviteMember}
          className="bg-gradient-to-r cursor-pointer from-indigo-600 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Invite Members</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members?.map((member) => (
              <tr key={member.user_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {member?.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {member?.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={member.role}
                    onChange={(e) =>
                      handleChangeRole(member.user_id, e.target.value)
                    }
                    className={`text-sm font-medium px-2 py-1 rounded border ${
                      member.role === "owner"
                        ? "bg-blue-100 text-blue-800 border-blue-200"
                        : member.role === "admin"
                        ? "bg-green-100 text-green-800 border-green-200"
                        : "bg-gray-100 text-gray-800 border-gray-200"
                    }`}
                    disabled={member.role === "owner"}
                  >
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(member.joined_at).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      member.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {member.role !== "owner" && (
                    <button
                      onClick={() => handleRemoveMember(member.user_id)}
                      className="text-red-600 hover:text-red-900 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MemberTab;

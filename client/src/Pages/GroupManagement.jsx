import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageLayout from "../layout/PageLayout";

import {
  Users,
  Settings,
  Edit,
  Check,
  X,
  Trash2,
  Mail,
  UserPlus,
  Calendar,
  Eye,
  EyeOff,
  BookOpen,
  Tag,
  Clock,
  Building,
  MoreVertical,
  ArrowLeft,
  MessagesSquare,
} from "lucide-react";
import Loading from "../components/loader/Loading";
import api from "../lib/axios";
import { toast } from "react-toastify";
import GroupInviteLink from "../components/modal/GroupInviteLink";
import { useAuthStore } from "../store/authStore";
import SettingsTab from "../components/tabs/groupTabs/SettingsTab";
import OverviewTab from "../components/tabs/groupTabs/OverviewTab";
import MemberTab from "../components/tabs/groupTabs/MemberTab";
import RequestTab from "../components/tabs/groupTabs/RequestTab";
import ConfirmModal from "../components/modal/ConfirmModal";
import JoinGroupModal from "../components/modal/JoinGroupModal";

const GroupManagement = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [group, setGroup] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showSettings, setShowSettings] = useState(false);
  const [showGroupLink, setShowGroupLink] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { user } = useAuthStore();

  const handleShowGroupLink = () => {
    setShowGroupLink((prev) => !prev);
  };

  useEffect(() => {
    if (!groupId) {
      navigate("/study-group");
      return;
    }
    setIsLoading(true);
    const get_group_info = async (groupId) => {
      try {
        const { data } = await api.get(`/group/get-group-info/${groupId}`);
        setGroup(data.group);
        // Load members if available from API, otherwise use mock
        if (data.group.members) {
          setMembers(data.group.members);
        }
      } catch (error) {
        console.log(error.message);
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setIsLoading(false);
      }
    };
    get_group_info(groupId);
  }, [groupId, navigate]);

  // Group Operations
  const handleEditGroup = () => {
    // Navigate to edit page or open edit modal
    console.log("Edit group:", group.group_id);
    // You can implement edit modal navigation here
  };

  const handleDeleteGroup = async () => {
    try {
      await api.delete(`/group/delete-group/${groupId}`);
      toast.success("Group deleted successfully");
      navigate("/my-groups");
    } catch (error) {
      console.log(error.message);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  // Member Selection Operations
  const toggleMemberSelection = (memberId) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllMembers = () => {
    if (selectedMembers.length === members.length) {
      setSelectedMembers([]);
    } else {
      setSelectedMembers(members.map((member) => member.user_id));
    }
  };

  const handleBulkDeleteMembers = async () => {
    if (selectedMembers.length === 0) return;

    try {
      await api.post(`/group/remove-members/${groupId}`, {
        memberIds: selectedMembers,
      });

      toast.success(`${selectedMembers.length} member(s) removed successfully`);
      setMembers((prev) =>
        prev.filter((member) => !selectedMembers.includes(member.user_id))
      );
      setSelectedMembers([]);
      setIsSelecting(false);
    } catch (error) {
      console.log(error.message);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleBulkRoleChange = async (newRole) => {
    if (selectedMembers.length === 0) return;

    try {
      await api.post(`/group/update-member-roles/${groupId}`, {
        memberIds: selectedMembers,
        role: newRole,
      });

      toast.success(`Role updated for ${selectedMembers.length} member(s)`);
      setMembers((prev) =>
        prev.map((member) =>
          selectedMembers.includes(member.user_id)
            ? { ...member, role: newRole }
            : member
        )
      );
      setSelectedMembers([]);
    } catch (error) {
      console.log(error.message);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const handleRemoveMember = async (memberId) => {
    try {
      await api.post(`/group/remove-members/${groupId}`, {
        memberIds: [memberId],
      });

      toast.success("Member removed successfully");
      setMembers((prev) =>
        prev.filter((member) => member.user_id !== memberId)
      );
    } catch (error) {
      console.log(error.message);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!group) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Group Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The group you're looking for doesn't exist.
            </p>
            <button
              onClick={() => navigate("/my-groups")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
            >
              Back to Study Groups
            </button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      {showGroupLink && (
        <GroupInviteLink
          onClose={() => handleShowGroupLink()}
          group_id={group.group_id}
          user_id={user.user_id}
        />
      )}
     
      {/* Delete Group Confirmation Modal */}
      {showDeleteModal && (
        <ConfirmModal
          title={"Delete Group"}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={() => handleDeleteGroup()}
          message={`Are you sure you want to delete "${group.group_name}"? This action cannot be undone.`}
          variant="danger"
          isOpen={showDeleteModal}
        />
      )}

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/my-groups")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {group.group_name}
                </h1>
                <p className="text-gray-600">
                  Manage your study group settings and members
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleEditGroup}
                className="bg-white cursor-pointer text-gray-700 px-4 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 border border-gray-300 flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Group</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="bg-red-600  cursor-pointer text-white px-4 py-2 rounded-xl font-semibold hover:bg-red-700 transition-all duration-200 flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Group</span>
              </button>
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="bg-indigo-600 cursor-pointer text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-all duration-200 flex items-center space-x-2"
              >
                <MessagesSquare className="w-4 h-4" />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {group.member_count}
                  </p>
                  <p className="text-sm text-gray-600">Members</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-balance font-bold text-gray-900 truncate">
                    {group.course}
                  </p>
                  <p className="text-sm text-gray-600">Course</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  {group.visibility === "public" ? (
                    <Eye className="w-6 h-6 text-purple-600" />
                  ) : (
                    <EyeOff className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 capitalize">
                    {group.visibility}
                  </p>
                  <p className="text-sm text-gray-600">Visibility</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 capitalize">
                    {group.status}
                  </p>
                  <p className="text-sm text-gray-600">Status</p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  "overview",
                  "members",
                  "settings",
                  "analytics",
                  "requests",
                ]?.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                      activeTab === tab
                        ? "border-indigo-500 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && <OverviewTab group={group} />}

              {activeTab === "members" && (
                <MemberTab
                  handleShowGroupLink={handleShowGroupLink}
                  members={members}
                  selectedMembers={selectedMembers}
                  isSelecting={isSelecting}
                  onToggleSelect={toggleMemberSelection}
                  onSelectAll={selectAllMembers}
                  onBulkDelete={handleBulkDeleteMembers}
                  onBulkRoleChange={handleBulkRoleChange}
                  onRemoveMember={handleRemoveMember}
                  onToggleSelecting={() => setIsSelecting(!isSelecting)}
                />
              )}

              {activeTab === "settings" && <SettingsTab group={group} />}

              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <h3 className="text-sm font-semibold text-gray-900">
                    Group Analytics
                  </h3>
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <p>Analytics features coming soon...</p>
                  </div>
                </div>
              )}
              {activeTab === "requests" && <RequestTab group={group} />}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default GroupManagement;

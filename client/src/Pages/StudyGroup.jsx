import React, { useState } from "react";
import PageLayout from "../layout/PageLayout";
import StudyGroupCard from "../components/cards/StudyGroupCard";
import { Search, Users, Plus, Filter, Eye } from "lucide-react";
import CreateGroup from "../components/modal/CreateGroup";
import { useNavigate } from "react-router-dom";
import Loading from "../components/loader/Loading";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useGroupStore } from "../store/groupStore";
import { useAuthStore } from "../store/authStore";

const StudyGroup = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActive, setFilterActive] = useState("all");
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const {getUserGroup, groups } = useGroupStore()
  const { user } = useAuthStore()
  const mockGroups = [
    {
      id: 1,
      group_name: "CS-201 Study Group",
      course: "Data Structures",
      members: 8,
      active: true,
      creator: {
        user_id: "user_id",
      },
      description: "Weekly study sessions for Data Structures midterm",
      nextSession: "Tomorrow, 3:00 PM",
    },
    {
      id: 2,
      group_name: "Math Study Buddies",
      course: "Calculus I",
      members: 5,
      active: true,
      creator: {
        user_id: "user_id",
      },
      description: "Collaborative problem solving and concept review",
      nextSession: "Friday, 2:00 PM",
    },
    {
      id: 3,
      group_name: "Physics Lab Partners",
      course: "Physics Lab",
      members: 3,
      active: false,
      creator: {
        user_id: "user_id",
      },
      description: "Lab report collaboration and experiment discussion",
      nextSession: "No upcoming sessions",
    },
    {
      id: 4,
      group_name: "Algorithm Masters",
      course: "Advanced Algorithms",
      members: 12,
      active: true,
      creator: {
        user_id: "user_id",
      },
      description: "Advanced algorithm practice and competition prep",
      nextSession: "Today, 6:00 PM",
    },
    {
      id: 5,
      group_name: "Database Design Team",
      course: "Database Systems",
      members: 6,
      active: true,
      creator: {
        user_id: "user_id",
      },
      description: "Project collaboration and SQL practice",
      nextSession: "Wednesday, 4:30 PM",
    },
    {
      id: 6,
      group_name: "Web Dev Crew",
      course: "Web Development",
      members: 4,
      active: false,
      creator: {
        user_id: "user_id",
      },
      description: "Frontend and backend development practice",
      nextSession: "On hiatus",
    },
  ];
  useEffect(() => {
    // Simulate API call
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        await getUserGroup(true, user.user_id)
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);
  const filteredGroups = groups.filter((group) => {
    const matchesSearch =
      group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterActive === "all" ||
      (filterActive === "active" && group.active) ||
      (filterActive === "inactive" && !group.active);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: groups.length,
    active: groups.filter((g) => g.active).length,
    totalMembers: groups.reduce((sum, group) => sum + parseInt(group.member_count), 0),
  };

  const handleCreateGroup = () => {
   if(!showCreateGroupModal){
     toast.info(
      "If you don't find the course you want to create group for, you can create the course before creating your group "
    );
   }
    setShowCreateGroupModal((prev) => !prev);
  };

  const handleViewPublicGroups = () => {
    navigate("/groups/public");
  };
  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageLayout>
      {showCreateGroupModal && <CreateGroup onClose={handleCreateGroup} />}
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              My Study Groups
            </h1>
            <p className="text-gray-600 mt-2">
              Manage and collaborate in your study groups
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
            <button
              onClick={handleViewPublicGroups}
              className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 border border-gray-300 shadow-sm flex items-center space-x-2"
            >
              <Eye className="w-5 h-5" />
              <span>Browse Public Groups</span>
            </button>
            <button
              onClick={handleCreateGroup}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-md hover:shadow-lg"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Group</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-sm text-gray-600">My Groups</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
                <p className="text-sm text-gray-600">Active Groups</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalMembers}
                </p>
                <p className="text-sm text-gray-600">Total Members</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search my groups, courses, or descriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            >
              <option value="all">All Groups</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Sort By</span>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {filteredGroups.length} of {groups.length} study groups
            {searchTerm && ` for "${searchTerm}"`}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Clear search
            </button>
          )}
        </div>

        {/* Study Groups Grid */}
        {filteredGroups.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <StudyGroupCard key={group.id} group={group} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {searchTerm ? "No groups found" : "No study groups yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "Try adjusting your search terms or browse public groups"
                : "Create your first study group or browse public groups to get started"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleViewPublicGroups}
                className="bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200 border border-gray-300"
              >
                Browse Public Groups
              </button>
              <button
                onClick={handleCreateGroup}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
              >
                Create New Group
              </button>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
};

export default StudyGroup;

import React, { useState, useEffect, use } from "react";
import PageLayout from "../layout/PageLayout";
import StudyGroupCard from "../components/cards/StudyGroupCard";
import { Search, Users, Filter, Plus, Grid, List, Eye } from "lucide-react";
import Loading from "../components/loader/Loading";
import { useGroupStore } from "../store/groupStore";
import RequestModal from "../components/modal/RequestModal";
import { toast } from "react-toastify";

const PublicGroups = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const { publicGroups, getAllGroups } = useGroupStore();
  const [groupToJoin, setGroupToJoin] = useState(null);
  const [request, setRequest] = useState(false);
  const [filters, setFilters] = useState({
    course: "",
    status: "all",
    sortBy: "newest",
  });
  const [viewMode, setViewMode] = useState("grid"); // grid or list

  // Mock data - replace with actual API call

  // Available courses for filter
  const availableCourses = [
    ...new Set(publicGroups.map((group) => group.course)),
  ];

  const handleSendRequest = async (groupToJoin) => {
    if (!groupToJoin) {
      return toast.error("cant send request without selecting group");
    }
    console.log(groupToJoin);
  };
  useEffect(() => {
    // Simulate API call
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        await getAllGroups();
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchGroups();
  }, []);
  useEffect(() => {
    setGroups(publicGroups);
  }, [publicGroups]);

  useEffect(() => {
    let results = groups;

    // Apply search filter
    if (searchTerm) {
      results = results.filter(
        (group) =>
          group.group_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.tags.some((tag) =>
            tag.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Apply course filter
    if (filters.course) {
      results = results.filter((group) => group.course === filters.course);
    }

    // Apply status filter
    if (filters.status !== "all") {
      results = results.filter((group) => group.status === filters.status);
    }

    // Apply sorting
    results = [...results].sort((a, b) => {
      switch (filters.sortBy) {
        case "newest":
          return new Date(b.created_at) - new Date(a.created_at);
        case "oldest":
          return new Date(a.created_at) - new Date(b.created_at);
        case "most_members":
          return b.member_count - a.member_count;
        case "least_members":
          return a.member_count - b.member_count;
        default:
          return 0;
      }
    });

    setFilteredGroups(results);
  }, [groups, searchTerm, filters]);

  const stats = {
    total: groups.length,
    totalMembers: groups.reduce((sum, group) => sum + parseInt(group.member_count), 0),
    active: groups.filter((g) => g.status === "active").length,
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <PageLayout>
      <RequestModal
        group={groupToJoin}
        isOpen={request}
        onClose={() => {
          setRequest(false);
        }}

      />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Eye className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-900">
                  Public Study Groups
                </h1>
              </div>
              <p className="text-gray-600">
                Discover and join study groups from students across all
                universities
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              {/* View Toggle */}
              <div className="flex bg-white border border-gray-300 rounded-xl p-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMode("grid");
                  }}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    viewMode === "grid"
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setViewMode("list");
                  }}
                  className={`p-2 rounded-lg cursor-pointer transition-colors ${
                    viewMode === "list"
                      ? "bg-indigo-100 text-indigo-600"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
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
                  <p className="text-sm text-gray-600">Public Groups</p>
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
                    {stats.totalMembers}
                  </p>
                  <p className="text-sm text-gray-600">Total Members</p>
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
                    {stats.active}
                  </p>
                  <p className="text-sm text-gray-600">Active Groups</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search groups, courses, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={filters.course}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, course: e.target.value }))
                  }
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="">All Courses</option>
                  {availableCourses.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </select>

                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
                  }
                  className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="most_members">Most Members</option>
                  <option value="least_members">Fewest Members</option>
                </select>

                <button className="px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors flex items-center space-x-2">
                  <Filter className="w-4 h-4" />
                  <span>More Filters</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing {filteredGroups.length} of {groups.length} public study
              groups
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          {/* Groups Grid/List */}
          {filteredGroups.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }
            >
              {filteredGroups.map((group) => (
                <StudyGroupCard
                  key={group.group_id}
                  group={group}
                  viewMode={viewMode}
                  isPublic={true}
                  setRequest={() => {
                    setRequest(true);
                    setGroupToJoin(group);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No groups found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "No public study groups available yet"}
              </p>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-200">
                Create First Group
              </button>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default PublicGroups;

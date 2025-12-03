import React, { useState } from "react";
import PageLayout from "../layout/PageLayout";
import { Search, BookOpen } from "lucide-react";
import AddResourceModal from "../components/modal/AddResources";
import ResourceCard from "../components/cards/ResourceCard";
import { useResourceStore } from "../store/resource.Store";
import { useEffect } from "react";

const Resources = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedcourse, setSelectedcourse] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleModal = () => {
    setIsModalOpen((prev) => !prev);
  };
  const { resources, fetchAllResource } = useResourceStore();
  useEffect(() => {
    const fetchCourse = async () => {
      await fetchAllResource();
    };
    fetchCourse();
  }, []);

  const categories = [
    { id: "all", name: "All Resources", count: resources.length },
    {
      id: "programming",
      name: "Programming",
      count: resources.filter((r) => r.course === "programming").length,
    },
    {
      id: "computer-science",
      name: "Computer Science",
      count: resources.filter((r) => r.course === "computer-science").length,
    },
    {
      id: "mathematics",
      name: "Mathematics",
      count: resources.filter((r) => r.course === "mathematics").length,
    },
    {
      id: "science",
      name: "Science",
      count: resources.filter((r) => r.course === "science").length,
    },
    {
      id: "productivity",
      name: "Productivity",
      count: resources.filter((r) => r.course === "productivity").length,
    },
  ];

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchescourse =
      selectedcourse === "all" || resource.course === selectedcourse;
    return matchesSearch && matchescourse;
  });

  const sortedResources = [...filteredResources].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return (b.downloads || b.views) - (a.downloads || a.views);
      case "rating":
        return b.rating - a.rating;
      case "recent":
      default:
        return new Date(b.uploadDate) - new Date(a.uploadDate);
    }
  });

  return (
    <PageLayout allowDefaultPadding={true}>
      <AddResourceModal isOpen={isModalOpen} onClose={() => handleModal()} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:justify-between gap-4 items-center">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Study Resources
              </h1>
              <p className="text-gray-600">
                Access learning materials, guides, and educational content
              </p>
            </div>
            <button
              onClick={() => handleModal()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors mb-4"
            >
              Add Resource
            </button>
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Bar */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search resources, topics, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Sort Dropdown */}
              <div className="lg:w-48">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="recent">Most Recent</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>
            </div>

            {/* course Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              {categories.map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedcourse(course.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedcourse === course.id
                      ? "bg-indigo-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {course.name} ({course.count})
                </button>
              ))}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedResources.map((resource) => (
              <ResourceCard resource={resource} />
            ))}
          </div>

          {/* Empty State */}
          {sortedResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No resources found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters to find what you're
                looking for.
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Resources;

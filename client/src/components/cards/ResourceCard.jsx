import { Video, FileText, Download, Trash2 } from "lucide-react";
import React from "react";
import { useAuthStore } from "../../store/authStore";
import api from "../../lib/axios";
import { toast } from "react-toastify";

const ResourceCard = ({ resource }) => {
  const { user } = useAuthStore();

  const getTypeIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="w-5 h-5" />;
      case "document":
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "video":
        return "bg-red-100 text-red-600";
      case "document":
      default:
        return "bg-blue-100 text-blue-600";
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch (error) {
      return "Invalid date";
    }
  };

  const handleDownload = async (resource_id) => {
    try {
      const { data } = await api.get(
        `/resource/download-resource/${resource_id}`
      );
      if (!data.success) {
        toast.error(data.message);
      }
      const url = data.url;
      const link = document.createElement("a");
      link.href = url;
      link.download = `edu_connect_${resource.title}` || "edu-connect-file";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("downloading your file");
      console.log("Downloading:", resource.title);
    } catch (error) {
      console.log(error);
      const errMsg = error?.response?.data?.message;
      toast.error(errMsg);
    }
  };

  const handleDelete = () => {
    // Add delete logic here
    console.log("Deleting:", resource.id);
  };

  const isOwner = user?.user_id === resource.uploader_id;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex flex-col h-full">
      <div className="p-6 flex-1">
        {/* Resource Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
            {getTypeIcon(resource.type)}
          </div>
        </div>

        {/* Resource Content */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
          {resource.title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {resource.description}
        </p>

        {/* Tags */}
        {resource.tags && resource.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {resource.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
            {resource.tags.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-md">
                +{resource.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 mt-auto">
          <span className="font-medium">{resource.author}</span>
          <span className="text-xs bg-gray-100 px-2 py-1 rounded">
            {formatDate(resource.uploadDate)}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between gap-2">
          {isOwner && (
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm flex-1 justify-center"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>
          )}
          <button
            onClick={() => handleDownload(resource.resource_id)}
            className={`flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm ${
              isOwner ? "flex-1" : "w-full"
            } justify-center`}
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;

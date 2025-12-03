import React from "react";
import { Tag, Clock, Building } from "lucide-react";
const OverviewTab = ({ group }) => {
  return (
    <div className="space-y-6">
      {/* Group Description */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Group Description
        </h3>
        <p className="text-gray-600 bg-gray-50 rounded-xl p-4">
          {group.description}
        </p>
      </div>

      {/* Meeting Schedule */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">
          Meeting Schedule
        </h3>
        <div className="flex items-center space-x-2 text-gray-600 bg-gray-50 rounded-xl p-4">
          <Clock className="w-5 h-5" />
          <span>{group.meeting_schedule}</span>
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {group.tags?.map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
            >
              <Tag className="w-3 h-3 mr-1" />
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Group Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            Group Information
          </h3>
          <div className="space-y-3">
            <div className="flex gap-5">
              <span className="text-gray-600">Created:</span>
              <span className="font-medium">
                {new Date(group.created_at).toLocaleDateString()}
              </span>
            </div>
            <div className="flex gap-5">
              <span className="text-gray-600">Max Members:</span>
              <span className="font-medium">{group.max_members}</span>
            </div>
            <div className="flex gap-5">
              <span className="text-gray-600">Creator:</span>
              <span className="font-medium">{group.creator?.full_name}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">
            University
          </h3>
          <div className="flex items-center space-x-2 text-gray-600">
            <Building className="w-5 h-5" />
            <span>{group.creator?.university}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;

import React from "react";
import ActivityLogCard, {
  CompactActivityCard,
  TimelineActivityCard,
} from "./ActivityLogCard";
import {
  Filter,
  Calendar,
  RefreshCw,
  Download,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const ActivityLogList = ({
  activities = [],
  viewType = "card",
  location = "/admin/logs",
  onRefresh,
}) => {
  // Group activities by date
  const groupByDate = (activities) => {
    const groups = {};
    activities.forEach((activity) => {
      const date = new Date(activity.timestamp).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(activity);
    });
    return groups;
  };

  const groupedActivities = groupByDate(activities);
  const navigate = useNavigate();
  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No activity found
        </h3>
        <p className="text-gray-500">
          There are no recent activities to display.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <p className="text-sm text-gray-500">
            {activities.length} activity logs
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onRefresh}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Refresh activities"
          >
            <RefreshCw className="w-5 h-5" />
          </button>

         {location && (
           <button
            onClick={() => {
              navigate(location);
            }}
            className="p-2 text-gray-500 flex items-center justify-center gap-1 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Refresh activities"
          >
            <p>more</p>
            <ChevronRight className="w-5 h-5" />
          </button>
         )}
        </div>
      </div>

      {/* Activity Logs */}
      {viewType === "timeline" ? (
        // Timeline View
        <div className="space-y-8">
          {Object.entries(groupedActivities).map(
            ([date, dateActivities], dateIndex) => (
              <div key={date}>
                <h3 className="text-sm font-semibold text-gray-900 mb-4 sticky top-0 bg-white py-2">
                  {date}
                </h3>
                <div className="space-y-0">
                  {dateActivities.map((activity, index) => (
                    <TimelineActivityCard
                      key={activity.activity_id}
                      activity={activity}
                      isLast={index === dateActivities.length - 1}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      ) : viewType === "compact" ? (
        // Compact View
        <div className="space-y-1">
          {activities.map((activity) => (
            <CompactActivityCard
              key={activity.activity_id}
              activity={activity}
            />
          ))}
        </div>
      ) : (
        // Card View (default)
        <div className="space-y-3">
          {activities.map((activity) => (
            <ActivityLogCard key={activity.activity_id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivityLogList;

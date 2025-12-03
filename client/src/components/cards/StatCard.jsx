import React from "react";

const StatCard = ({ icon: Icon, title, value, color }) => (
  <div className="bg-white rounded-2xl p-6 pt-4 border border-gray-200 shadow-md hover:shadow-xl transition-shadow duration-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export default StatCard;

import React from "react";
import DashboardLayout from "../components/DashboardLayout";

const ScheduleManagement = () => {
  return (
    <DashboardLayout>
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">🗓 Schedule Management</h1>
            <p className="text-gray-600 mb-6">Create, view, and manage system schedules or calendar-based items.</p>

      {/* 未来可以接入日历组件 / 时间线列表 */}
            <div className="bg-white p-4 rounded shadow">
            <p className="text-gray-500 italic">📅 Schedule content will appear here (e.g., calendar view, timeline)</p>
            </div>
        </div>

    </DashboardLayout>

  );
};

export default ScheduleManagement;
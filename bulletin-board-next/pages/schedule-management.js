import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function Dashboard() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [schedules, setSchedules] = useState([]); // 暂时空数组

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-6">Schedule Management</h2>

        {/* 顶部按钮区域 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            {/* 搜索框 */}
            <input
              type="text"
              placeholder="Search by name or file name"
              value={searchKeyword}
              onChange={handleSearchChange}
              className="border rounded px-4 py-2 w-64"
            />

            {/* 日期筛选（以后可以改成日期范围组件） */}
            <input
              type="date"
              value={dateFilter}
              onChange={handleDateChange}
              className="border rounded px-4 py-2"
            />
          </div>

          {/* 新增排期按钮 */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
            + Add New Schedule
          </button>
        </div>

        {/* 播放计划列表表格 */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Media Type</th>
                <th className="py-3 px-4 text-left">Start Time</th>
                <th className="py-3 px-4 text-left">End Time</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-400">
                    No schedules found.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule.id}>
                    <td className="py-3 px-4">{schedule.name}</td>
                    <td className="py-3 px-4">{schedule.mediaType}</td>
                    <td className="py-3 px-4">{schedule.startTime}</td>
                    <td className="py-3 px-4">{schedule.endTime}</td>
                    <td className="py-3 px-4">{schedule.status}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button className="text-blue-500 hover:underline">Edit</button>
                      <button className="text-red-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页器占位 */}
        <div className="mt-6 flex justify-center space-x-2">
          <button className="px-3 py-1 border rounded">Prev</button>
          <button className="px-3 py-1 border rounded">Next</button>
        </div>
      </div>
    </div>
  );
}
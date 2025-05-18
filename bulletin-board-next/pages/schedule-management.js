import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import ScheduleForm from "../components/ScheduleForm";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Pagination from "../components/Pagination";

// mock data
const mockSchedules = [
  {
    id: 1,
    name: "Morning Promotion",
    mediaType: "video",
    startTime: "2024-06-10T08:00",
    endTime: "2024-06-10T10:00",
    status: "Scheduled",
  },
  {
    id: 2,
    name: "Event Poster",
    mediaType: "image",
    startTime: "2024-06-11T09:00",
    endTime: "2024-06-11T18:00",
    status: "Completed",
  },
];

export default function ScheduleManagement() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [allSchedules, setAllSchedules] = useState(mockSchedules);

  // 模拟fetchSchedules
  const fetchSchedules = () => {
    setLoading(true);
    setTimeout(() => {
      let filtered = allSchedules.filter((s) => {
        const matchKeyword =
          s.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          (s.mediaType && s.mediaType.toLowerCase().includes(searchKeyword.toLowerCase()));
        const matchDate = dateFilter ? s.startTime.slice(0, 10) === dateFilter : true;
        const matchStatus = statusFilter ? s.status === statusFilter : true;
        return matchKeyword && matchDate && matchStatus;
      });
      const total = filtered.length;
      const start = (currentPage - 1) * pageSize;
      const end = start + pageSize;
      setSchedules(filtered.slice(start, end));
      setTotalPages(Math.max(1, Math.ceil(total / pageSize)));
      setLoading(false);
    }, 300);
  };

  useEffect(() => {
    fetchSchedules();
    // eslint-disable-next-line
  }, [currentPage, pageSize, searchKeyword, dateFilter, statusFilter, allSchedules]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(1);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleAddNew = () => {
    setSelectedSchedule(null);
    setShowForm(true);
  };

  const handleEdit = (schedule) => {
    setSelectedSchedule(schedule);
    setShowForm(true);
  };

  const handleDelete = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setAllSchedules((prev) => prev.filter((s) => s.id !== selectedSchedule.id));
    setShowDeleteConfirm(false);
  };

  const handleSave = (newSchedule) => {
    if (newSchedule.id) {
      // update
      setAllSchedules((prev) =>
        prev.map((s) => (s.id === newSchedule.id ? { ...newSchedule } : s))
      );
    } else {
      // create
      setAllSchedules((prev) => [
        ...prev,
        { ...newSchedule, id: Date.now() },
      ]);
    }
    setShowForm(false);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-6">Schedule Management</h2>
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            <input
              type="text"
              placeholder="Search by name or file name"
              value={searchKeyword}
              onChange={handleSearchChange}
              className="border rounded px-4 py-2 w-64"
            />
            <input
              type="date"
              value={dateFilter}
              onChange={handleDateChange}
              className="border rounded px-4 py-2"
            />
            <select
              value={statusFilter}
              onChange={handleStatusChange}
              className="border rounded px-4 py-2"
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          >
            + Add New Schedule
          </button>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-6">Loading...</div>
          ) : (
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
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          schedule.status === 'Scheduled' ? 'bg-green-100 text-green-800' :
                          schedule.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {schedule.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 space-x-2">
                        <button
                          onClick={() => handleEdit(schedule)}
                          className="text-blue-500 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(schedule)}
                          className="text-red-500 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
        {showForm && (
          <ScheduleForm
            schedule={selectedSchedule}
            onClose={() => setShowForm(false)}
            onSave={handleSave}
          />
        )}
        {showDeleteConfirm && (
          <DeleteConfirmation
            onConfirm={handleDeleteConfirm}
            onCancel={() => setShowDeleteConfirm(false)}
            itemName={selectedSchedule?.name}
          />
        )}
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Pagination from "../components/Pagination";
import Select from "react-select";
import { useMemo } from "react";
import { useRouter } from "next/router";


export default function ScheduleManagement() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [error, setError] = useState("");
  const [contentOptions, setContentOptions] = useState([]);
  const [selectedContentIds, setSelectedContentIds] = useState([]);
  const [selectedPanelIds, setSelectedPanelIds] = useState([]);
  const panelOptions = [
    { value: 1, label: "Panel 1" },
    { value: 2, label: "Panel 2" }
  ];

  // memo 处理已选内容项
  const selectedContentOptions = useMemo(() => {
    if (!contentOptions.length || !selectedContentIds.length) return [];
    return contentOptions.filter(opt => selectedContentIds.includes(opt.value));
  }, [contentOptions, selectedContentIds]);

  const selectedPanelOptions = useMemo(() => {
    if (!panelOptions.length || !selectedPanelIds.length) return [];
    return panelOptions.filter(opt => selectedPanelIds.includes(opt.value));
  }, [panelOptions, selectedPanelIds]);


  const fetchSchedules = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const query = new URLSearchParams({
        page: currentPage,
        size: pageSize,
        ...(searchKeyword && { keyword: searchKeyword }),
        ...(dateFilter && { date: dateFilter })
      }).toString();

      const res = await fetch(`/api/schedules?${query}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setSchedules(data.content);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [currentPage, pageSize, searchKeyword, dateFilter]);

  useEffect(() => {
    if (showForm && selectedSchedule !== undefined) {
      const fetchContents = async () => {
        try {
          const token = localStorage.getItem("authToken");

          // 获取内容文件列表
          const res = await fetch("/api/files", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch content files");

          const files = await res.json();

          // 设置下拉框可选项
          setContentOptions(
            files.map((file) => ({
              value: file.id,
              label: `${file.originalName} (ID: ${file.id})`,
            }))
          );

          // 设置已选 contentIds
          if (selectedSchedule?.contents) {
            setSelectedContentIds(selectedSchedule.contents.map((c) => c.id));
          } else {
            setSelectedContentIds([]);
          }

          // 设置已选 panelIds
          if (selectedSchedule?.panels) {
            setSelectedPanelIds(selectedSchedule.panels.map((p) => p.id));
          } else {
            setSelectedPanelIds([]);
          }
        } catch (error) {
          console.error("Failed to load content list", error);
        }
      };

      fetchContents();
    }
  }, [showForm, selectedSchedule]);

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
    setCurrentPage(0);
  };

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
    setCurrentPage(0);
  };

  const handleAddNew = () => {
    setSelectedSchedule(null);
    setSelectedContentIds([]);
    setShowForm(true);
  };

  const handleEdit = async (schedule) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/schedules/${schedule.id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());

      const detailedSchedule = await res.json();

      // ✅ 设置完整调度详情
      setSelectedSchedule(detailedSchedule);

      // ✅ 让弹窗显示
      setShowForm(true);
    } catch (err) {
      console.error("Error fetching schedule details:", err);
      setError("Failed to fetch schedule details.");
    }
  };


  const handleDelete = (schedule) => {
    setSelectedSchedule(schedule);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`/api/schedules/${selectedSchedule.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(await res.text());

      setShowDeleteConfirm(false);
      fetchSchedules();
    } catch (err) {
      console.error("Error deleting schedule:", err);
      setError("Failed to delete schedule");
    }
  };

  const handleSave = async (formData) => {
    try {
      const token = localStorage.getItem("authToken");
      const method = formData.id ? "PUT" : "POST";
      const url = formData.id
        ? `/api/schedules/${formData.id}`
        : `/api/schedules`;

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          contentIds: selectedContentIds
        })
      });

      if (!res.ok) throw new Error(await res.text());

      setShowForm(false);
      fetchSchedules();
    } catch (err) {
      console.error("Error saving schedule:", err);
      setError("Failed to save schedule");
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Schedule Management</h2>
          <button
            onClick={handleAddNew}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
          >
            + Add New Schedule
          </button>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="flex space-x-4 mb-6">
          <input
            type="text"
            placeholder="Search schedules..."
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
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="text-center py-6">Loading...</div>
          ) : (
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Start Time</th>
                  <th className="py-3 px-4 text-left">End Time</th>
                  <th className="py-3 px-4 text-left">Content Count</th>
                  <th className="py-3 px-4 text-left">Panel Count</th>
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
                      <td className="py-3 px-4">{new Date(schedule.startTime).toLocaleString()}</td>
                      <td className="py-3 px-4">{new Date(schedule.endTime).toLocaleString()}</td>
                      <td className="py-3 px-4">{schedule.contentCount}</td>
                      <td className="py-3 px-4">{schedule.panelCount}</td>
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
                        <button
                          onClick={() => router.push(`/player?scheduleId=${schedule.id}`)}
                          className="text-green-600 hover:underline"
                        >
                          View
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
          currentPage={currentPage + 1}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page - 1)}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
              <h2 className="text-xl font-bold mb-4">
                {selectedSchedule ? "Edit Schedule" : "Add Schedule"}
              </h2>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.target;
                  const formData = {
                    id: selectedSchedule?.id,
                    name: form.name.value,
                    startTime: form.startTime.value,
                    endTime: form.endTime.value,
                    repeatType: form.repeatType.value,
                    priority: parseInt(form.priority.value),
                    contentIds: selectedContentIds,
                    panelIds: selectedPanelIds,
                  };
                  handleSave(formData);
                }}
                className="space-y-4"
              >
                <div>
                  <label className="block mb-1 font-semibold" htmlFor="name">Schedule Name</label>
                  <input id="name" name="name" type="text" defaultValue={selectedSchedule?.name || ""} required className="w-full border px-3 py-2 rounded" />
                </div>

                <div>
                  <label className="block mb-1 font-semibold" htmlFor="startTime">Start Time</label>
                  <input id="startTime" name="startTime" type="datetime-local" defaultValue={selectedSchedule?.startTime?.slice(0, 16) || ""} required className="w-full border px-3 py-2 rounded" />
                </div>

                <div>
                  <label className="block mb-1 font-semibold" htmlFor="endTime">End Time</label>
                  <input id="endTime" name="endTime" type="datetime-local" defaultValue={selectedSchedule?.endTime?.slice(0, 16) || ""} required className="w-full border px-3 py-2 rounded" />
                </div>

                <div>
                  <label className="block mb-1 font-semibold" htmlFor="repeatType">Repeat Type</label>
                  <select id="repeatType" name="repeatType" defaultValue={selectedSchedule?.repeatType || "ONCE"} className="w-full border px-3 py-2 rounded">
                    <option value="ONCE">ONCE</option>
                    <option value="DAILY">DAILY</option>
                    <option value="WEEKLY">WEEKLY</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 font-semibold" htmlFor="priority">Priority (1~10)</label>
                  <input id="priority" name="priority" type="number" min={1} max={10} placeholder="e.g. 1 to 10" defaultValue={selectedSchedule?.priority || 1} className="w-full border px-3 py-2 rounded" />
                </div>

                <div>
                  <label className="block mb-1 font-semibold" htmlFor="contentIds">Select Content Files</label>
                  <Select
                    id="contentIds"
                    name="contentIds"
                    isMulti
                    options={contentOptions}
                    value={selectedContentOptions}
                    onChange={(selected) => setSelectedContentIds(selected.map(opt => opt.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block mb-1 font-semibold" htmlFor="panelIds">Select Panel IDs</label>
                  <Select
                    id="panelIds"
                    name="panelIds"
                    isMulti
                    options={panelOptions}
                    value={selectedPanelOptions}
                    onChange={(selected) => setSelectedPanelIds(selected.map(opt => opt.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button type="button" onClick={() => setShowForm(false)} className="bg-gray-300 px-4 py-2 rounded">Cancel</button>
                  <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">{selectedSchedule ? "Update" : "Create"}</button>
                </div>
              </form>
            </div>
          </div>
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
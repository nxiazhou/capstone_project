import { useState, useEffect, useMemo, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import DeleteConfirmation from "../components/DeleteConfirmation";
import Pagination from "../components/Pagination";
import Select from "react-select";
import { useRouter } from "next/router";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

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
  const [selectedContents, setSelectedContents] = useState([]);
  const [selectedPanelIds, setSelectedPanelIds] = useState([]);
  const [panelOptions, setPanelOptions] = useState([]);
  
  // 时间表相关状态
  const [viewMode, setViewMode] = useState("list"); // "list", "timetable", or "panel-timetable"
  const [selectedWeek, setSelectedWeek] = useState(new Date());
  const [timetableData, setTimetableData] = useState({});
  const [selectedPanelForTimetable, setSelectedPanelForTimetable] = useState(null);
  const [panelTimetableData, setPanelTimetableData] = useState({});

  // 生成时间表数据
  const generateTimetableData = useCallback((schedules, weekStart) => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
      { start: '07:00', end: '09:00', label: '07:00-09:00' },
      { start: '09:00', end: '11:00', label: '09:00-11:00' },
      { start: '11:00', end: '13:00', label: '11:00-13:00' },
      { start: '13:00', end: '15:00', label: '13:00-15:00' },
      { start: '15:00', end: '17:00', label: '15:00-17:00' },
      { start: '17:00', end: '19:00', label: '17:00-19:00' },
      { start: '19:00', end: '21:00', label: '19:00-21:00' }
    ];

    const timetable = {};

    // 初始化时间表结构
    weekDays.forEach(day => {
      timetable[day] = {};
      timeSlots.forEach(slot => {
        timetable[day][slot.label] = [];
      });
    });

    // 填充调度数据
    schedules.forEach(schedule => {
      const startDate = new Date(schedule.startTime);
      const endDate = new Date(schedule.endTime);
      
      // 检查调度是否在当前周内
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      if (startDate <= weekEnd && endDate >= weekStart) {
        const dayName = weekDays[startDate.getDay() === 0 ? 6 : startDate.getDay() - 1];
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        
        // 找到对应的时间段
        timeSlots.forEach(slot => {
          const slotStart = parseInt(slot.start.split(':')[0]);
          const slotEnd = parseInt(slot.end.split(':')[0]);
          
          if ((startHour < slotEnd && endHour > slotStart) || 
              (startHour >= slotStart && startHour < slotEnd) ||
              (endHour > slotStart && endHour <= slotEnd)) {
            timetable[dayName][slot.label].push({
              id: schedule.id,
              name: schedule.name,
              panels: schedule.panels || [],
              contentCount: schedule.contentCount || 0
            });
          }
        });
      }
    });

    return timetable;
  }, []);

  // 生成面板特定的时间表数据
  const generatePanelTimetableData = useCallback((schedules, weekStart, panelId) => {
    const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const timeSlots = [
      { start: '07:00', end: '09:00', label: '07:00-09:00' },
      { start: '09:00', end: '11:00', label: '09:00-11:00' },
      { start: '11:00', end: '13:00', label: '11:00-13:00' },
      { start: '13:00', end: '15:00', label: '13:00-15:00' },
      { start: '15:00', end: '17:00', label: '15:00-17:00' },
      { start: '17:00', end: '19:00', label: '17:00-19:00' },
      { start: '19:00', end: '21:00', label: '19:00-21:00' }
    ];

    const timetable = {};

    // 初始化时间表结构
    weekDays.forEach(day => {
      timetable[day] = {};
      timeSlots.forEach(slot => {
        timetable[day][slot.label] = [];
      });
    });

    // 填充特定面板的调度数据
    schedules.forEach(schedule => {
      const startDate = new Date(schedule.startTime);
      const endDate = new Date(schedule.endTime);
      
      // 检查调度是否在当前周内且包含选中的面板
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      const hasPanel = schedule.panels && schedule.panels.some(p => p.id === panelId);
      
      if (startDate <= weekEnd && endDate >= weekStart && hasPanel) {
        const dayName = weekDays[startDate.getDay() === 0 ? 6 : startDate.getDay() - 1];
        const startHour = startDate.getHours();
        const endHour = endDate.getHours();
        
        // 找到对应的时间段
        timeSlots.forEach(slot => {
          const slotStart = parseInt(slot.start.split(':')[0]);
          const slotEnd = parseInt(slot.end.split(':')[0]);
          
          if ((startHour < slotEnd && endHour > slotStart) || 
              (startHour >= slotStart && startHour < slotEnd) ||
              (endHour > slotStart && endHour <= slotEnd)) {
            timetable[dayName][slot.label].push({
              id: schedule.id,
              name: schedule.name,
              contentCount: schedule.contentCount || 0
            });
          }
        });
      }
    });

    return timetable;
  }, []);

  // 当调度数据或选择的周改变时，更新时间表数据
  useEffect(() => {
    if (viewMode === "timetable" && schedules.length > 0) {
      const weekStart = new Date(selectedWeek);
      weekStart.setDate(selectedWeek.getDate() - selectedWeek.getDay() + 1);
      weekStart.setHours(0, 0, 0, 0);
      
      const timetable = generateTimetableData(schedules, weekStart);
      setTimetableData(timetable);
    }
  }, [schedules, selectedWeek, viewMode, generateTimetableData]);

  // 当面板选择改变时，更新面板时间表数据
  useEffect(() => {
    if (viewMode === "panel-timetable" && schedules.length > 0 && selectedPanelForTimetable) {
      const weekStart = new Date(selectedWeek);
      weekStart.setDate(selectedWeek.getDate() - selectedWeek.getDay() + 1);
      weekStart.setHours(0, 0, 0, 0);
      
      const timetable = generatePanelTimetableData(schedules, weekStart, selectedPanelForTimetable.value);
      setPanelTimetableData(timetable);
    }
  }, [schedules, selectedWeek, viewMode, selectedPanelForTimetable, generatePanelTimetableData]);

  // 获取周的开始和结束日期
  const getWeekRange = useCallback((date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay() + 1);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    
    return { start, end };
  }, []);

  // 切换到上一周
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(selectedWeek.getDate() - 7);
    setSelectedWeek(newDate);
  };

  // 切换到下一周
  const goToNextWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(selectedWeek.getDate() + 7);
    setSelectedWeek(newDate);
  };

  // 切换到今天
  const goToToday = () => {
    setSelectedWeek(new Date());
  };

  // memo 处理已选内容项
  const selectedContentOptions = useMemo(() => {
    if (!contentOptions.length || !selectedContents.length) return [];
    return selectedContents
      .sort((a, b) => a.orderNo - b.orderNo)
      .map(item => contentOptions.find(opt => opt.value === item.id))
      .filter(Boolean);
  }, [contentOptions, selectedContents]);

  const selectedPanelOptions = useMemo(() => {
    if (!panelOptions.length || !selectedPanelIds.length) return [];
    return panelOptions.filter(opt => selectedPanelIds.includes(opt.value));
  }, [panelOptions, selectedPanelIds]);

  // fetchPanels 提升到组件顶层，并用 useCallback 包裹
  const fetchPanels = useCallback(async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("/api/panels", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });
      const result = await res.json();
      if (result.code === 200) {
        const options = result.data.map(panel => ({
          value: panel.id,
          label: `${panel.name} (${panel.location})`
        }));
        setPanelOptions(options);
      } else {
        setPanelOptions([]);
      }
    } catch (error) {
      setPanelOptions([]);
    }
  }, []);

  // 只要切换到 panel-timetable 就加载面板
  useEffect(() => {
    if (viewMode === "panel-timetable") {
      fetchPanels();
    }
  }, [viewMode, fetchPanels]);

  const fetchSchedules = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("authToken");
      const query = new URLSearchParams({
        ...(searchKeyword && { keyword: searchKeyword }),
        ...(dateFilter && { date: dateFilter })
      }).toString();

      // 手动记录请求信息
      console.log(
        `GET /api/schedules?${query} HTTP/1.1\n` +
        `Host: ${window.location.host}\n` +
        `Authorization: Bearer ${token}\n`
      );

      const res = await fetch(`/api/schedules?${query}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      const scheduleList = data.content;

      // 并行请求每个 schedule 的详情，补 panels 字段
      const detailPromises = scheduleList.map(async (sch) => {
        try {
          const detailRes = await fetch(`/api/schedules/${sch.id}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` }
          });
          if (!detailRes.ok) return sch;
          const detail = await detailRes.json();
          return { ...sch, panels: detail.panels || [] };
        } catch {
          return sch;
        }
      });

      const schedulesWithPanels = await Promise.all(detailPromises);

      setSchedules(schedulesWithPanels);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error("Error fetching schedules:", err);
      setError("Failed to load schedules");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchKeyword, dateFilter, currentPage, pageSize]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

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
          setContentOptions(
            files.map((file) => ({
              value: file.id,
              label: `${file.originalName} (ID: ${file.id})`,
            }))
          );
          if (selectedSchedule?.contents) {
            const ordered = selectedSchedule.contents
              .sort((a, b) => a.order_no - b.order_no)
              .map((c) => ({
                id: c.id,
                label: `${c.originalName} (ID: ${c.id})`,
                orderNo: c.orderNo
              }));
            setSelectedContents(ordered);
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
      fetchPanels(); // 新增：弹窗打开时自动加载面板列表
    }
  }, [showForm, selectedSchedule, fetchPanels]);

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
    setSelectedContents([]); // ✅ 这是你想要做的：清空内容
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
      const isEdit = !!formData.id;
      const method = isEdit ? "PUT" : "POST";
      const url = isEdit
        ? `/api/schedules/${formData.id}`
        : `/api/schedules`;

      const payload = {
        name: formData.name,
        startTime: formData.startTime,
        endTime: formData.endTime,
        repeatType: formData.repeatType,
        priority: formData.priority,
        contents: selectedContents.map((item, index) => ({
          contentId: item.id,
          orderNo: index + 1,
        })),
        panelIds: selectedPanelIds,
      };

      console.log("📤 正在保存调度：", {
        method,
        url,
        payload,
      });

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`服务器返回错误: ${errText}`);
      }

      setShowForm(false);
      fetchSchedules();
    } catch (err) {
      console.error("保存调度时发生错误：", err);
      setError("Failed to save schedule: " + err.message);
    }
  };

  const role = typeof window !== "undefined" ? localStorage.getItem('authRole') : null;

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

        {/* View mode toggle buttons */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded font-medium ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("timetable")}
              className={`px-4 py-2 rounded font-medium ${
                viewMode === "timetable"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Timetable View
            </button>
            <button
              onClick={() => setViewMode("panel-timetable")}
              className={`px-4 py-2 rounded font-medium ${
                viewMode === "panel-timetable"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Panel Timetable
            </button>
          </div>

          {/* Timetable navigation */}
          {(viewMode === "timetable" || viewMode === "panel-timetable") && (
            <div className="flex items-center space-x-4">
              <button
                onClick={goToPreviousWeek}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                ← Previous Week
              </button>
              <button
                onClick={goToToday}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Today
              </button>
              <button
                onClick={goToNextWeek}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                Next Week →
              </button>
              <span className="text-lg font-semibold">
                {getWeekRange(selectedWeek).start.toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })} - {getWeekRange(selectedWeek).end.toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          )}
        </div>

        {/* Panel selection for panel timetable */}
        {viewMode === "panel-timetable" && (
          <div className="mb-6">
            <label className="block mb-2 font-semibold">Select Panel for Timetable View</label>
            <Select
              options={panelOptions}
              value={selectedPanelForTimetable}
              onChange={setSelectedPanelForTimetable}
              placeholder="Choose a panel..."
              className="w-64"
            />
          </div>
        )}

        {/* Search and filter */}
        {viewMode === "list" && (
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
        )}

        {/* List view */}
        {viewMode === "list" && (
          <>
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
                            {role === 'admin' && (
                              <>
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
                              </>
                            )}
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
          </>
        )}

        {/* Timetable view */}
        {viewMode === "timetable" && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left border-r border-gray-200 min-w-[120px]">Time</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Monday</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Tuesday</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Wednesday</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Thursday</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Friday</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Saturday</th>
                      <th className="py-3 px-4 text-center min-w-[150px]">Sunday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      '07:00-09:00',
                      '09:00-11:00', 
                      '11:00-13:00',
                      '13:00-15:00',
                      '15:00-17:00',
                      '17:00-19:00',
                      '19:00-21:00'
                    ].map((timeSlot) => (
                      <tr key={timeSlot} className="border-b border-gray-200">
                        <td className="py-3 px-4 text-sm font-medium bg-gray-50 border-r border-gray-200">
                          {timeSlot}
                        </td>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <td
                            key={day}
                            className="py-2 px-2 border-r border-gray-200 min-h-[100px] align-top"
                          >
                            {timetableData[day]?.[timeSlot]?.map((schedule) => (
                              <div
                                key={schedule.id}
                                className="mb-2 p-2 bg-blue-100 border border-blue-300 rounded text-xs"
                                onClick={() => {
                                  // 从原始schedules数组中找到完整的调度数据
                                  const fullSchedule = schedules.find(s => s.id === schedule.id);
                                  if (fullSchedule) {
                                    handleEdit(fullSchedule);
                                  }
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="font-medium text-blue-800 mb-1">
                                  {schedule.name}
                                </div>
                                <div className="text-blue-600">
                                  Content: {schedule.contentCount} items
                                </div>
                                <div className="text-blue-600">
                                  Panels: {schedule.panels.length} panels
                                </div>
                                {schedule.panels.length > 0 && (
                                  <div className="text-blue-500 text-xs mt-1">
                                    {schedule.panels.slice(0, 2).map(p => p.name || p.id).join(', ')}
                                    {schedule.panels.length > 2 && '...'}
                                  </div>
                                )}
                              </div>
                            ))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Panel timetable view */}
        {viewMode === "panel-timetable" && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="text-center py-6">Loading...</div>
            ) : !selectedPanelForTimetable ? (
              <div className="text-center py-12 text-gray-500">
                Please select a panel to view its timetable
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-4 bg-blue-50 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-blue-800">
                    Timetable for {selectedPanelForTimetable.label}
                  </h3>
                </div>
                <table className="min-w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left border-r border-gray-200 min-w-[120px]">Time</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Monday</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Tuesday</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Wednesday</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Thursday</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Friday</th>
                      <th className="py-3 px-4 text-center border-r border-gray-200 min-w-[150px]">Saturday</th>
                      <th className="py-3 px-4 text-center min-w-[150px]">Sunday</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      '07:00-09:00',
                      '09:00-11:00', 
                      '11:00-13:00',
                      '13:00-15:00',
                      '15:00-17:00',
                      '17:00-19:00',
                      '19:00-21:00'
                    ].map((timeSlot) => (
                      <tr key={timeSlot} className="border-b border-gray-200">
                        <td className="py-3 px-4 text-sm font-medium bg-gray-50 border-r border-gray-200">
                          {timeSlot}
                        </td>
                        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                          <td key={day} className="py-2 px-2 border-r border-gray-200 min-h-[100px] align-top">
                            {panelTimetableData[day]?.[timeSlot]?.map((schedule) => (
                              <div
                                key={schedule.id}
                                className="mb-2 p-2 bg-green-100 border border-green-300 rounded text-xs"
                                onClick={() => {
                                  // 从原始schedules数组中找到完整的调度数据
                                  const fullSchedule = schedules.find(s => s.id === schedule.id);
                                  if (fullSchedule) {
                                    handleEdit(fullSchedule);
                                  }
                                }}
                                style={{ cursor: 'pointer' }}
                              >
                                <div className="font-medium text-green-800 mb-1">
                                  {schedule.name}
                                </div>
                                <div className="text-green-600">
                                  Content: {schedule.contentCount} items
                                </div>
                              </div>
                            ))}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
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
                    contentIds: selectedContents.map((item) => item.id),
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
                    value={selectedContents
                      .sort((a, b) => a.orderNo - b.orderNo)
                      .map(item => contentOptions.find(opt => opt.value === item.id))
                      .filter(Boolean)}
                    onChange={(selected) => {
                    // 新选择的 id 列表
                    const selectedIds = selected.map(opt => opt.value);

                    // 保留原有的顺序信息
                    const contentMap = new Map(selectedContents.map(item => [item.id, item]));

                    // 构建新的顺序数组
                    const updated = selectedIds.map((id, index) => {
                      const existing = contentMap.get(id);
                      return {
                        id,
                        label: selected.find(opt => opt.value === id).label,
                        orderNo: existing?.orderNo ?? index + 1,
                      };
                    });

                    // 强制排序一遍
                    updated.sort((a, b) => a.orderNo - b.orderNo);

                    console.log("🧾 updated from Select onChange (preserving orderNo):", updated);
                    setSelectedContents(updated);
                  }}
                    className="w-full"
                  />
                  <DragDropContext
                    onDragEnd={(result) => {
                      if (!result.destination) return;

                      const reordered = Array.from(selectedContents);
                      const [moved] = reordered.splice(result.source.index, 1);
                      reordered.splice(result.destination.index, 0, moved);

                      const withOrder = reordered.map((item, index) => ({
                        ...item,
                        orderNo: index + 1,
                      }));

                      console.log("🧪 reordered with orderNo:", withOrder); // 这一行才会输出
                      setSelectedContents(withOrder);
                    }}
                  >
                    <Droppable droppableId="content-list" isDropDisabled={false} isCombineEnabled={false}  ignoreContainerClipping={false}>
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="mt-2 border rounded-lg p-2"
                        >
                          {selectedContents.map((item, index) => (
                            <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-gray-50 p-2 mb-2 rounded flex items-center"
                                >
                                  <span className="mr-2">#{index + 1}</span>
                                  {item.label}
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
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
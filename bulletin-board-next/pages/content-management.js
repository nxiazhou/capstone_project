import Sidebar from "../components/Sidebar";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const mockContents = [
  {
    id: 1,
    name: "Promo Video",
    mediaType: "video",
    url: "https://www.example.com/video1.mp4",
    uploadTime: "2024-06-01 10:00",
    auditStatus: "pending",
    violationType: "none",
  },
  {
    id: 2,
    name: "Event Poster",
    mediaType: "image",
    url: "https://www.example.com/image1.jpg",
    uploadTime: "2024-06-02 14:30",
    auditStatus: "approved",
    violationType: "none",
  },
  {
    id: 3,
    name: "Ad Banner",
    mediaType: "image",
    url: "https://www.example.com/image2.jpg",
    uploadTime: "2024-06-03 09:20",
    auditStatus: "rejected",
    violationType: "nudity",
  },
];

const mockSchedules = [
  {
    id: 1,
    contentId: 1,
    contentName: "Promo Video",
    mediaType: "video",
    startTime: "2024-06-10 08:00",
    endTime: "2024-06-10 12:00",
    status: "Scheduled",
  },
  {
    id: 2,
    contentId: 2,
    contentName: "Event Poster",
    mediaType: "image",
    startTime: "2024-06-11 09:00",
    endTime: "2024-06-11 18:00",
    status: "No Scheduled",
  },
];

export default function ContentManagement() {
  // Content Management State
  const [contents, setContents] = useState(mockContents);
  const [showContentModal, setShowContentModal] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [contentPage, setContentPage] = useState(1);
  const [contentSearch, setContentSearch] = useState("");

  // Schedule Management State
  const [schedules, setSchedules] = useState(mockSchedules);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [scheduleSearch, setScheduleSearch] = useState("");
  const [scheduleStatus, setScheduleStatus] = useState("");

  // Content Modal Form State
  const [contentForm, setContentForm] = useState({
    name: "",
    mediaType: "video",
    url: "",
  });

  // Schedule Modal Form State
  const [scheduleForm, setScheduleForm] = useState({
    contentId: "",
    startTime: "",
    endTime: "",
    status: "Scheduled",
  });

  // Content Pagination
  const pageSize = 5;
  const filteredContents = contents.filter(
    (c) =>
      c.name.toLowerCase().includes(contentSearch.toLowerCase()) ||
      c.mediaType.toLowerCase().includes(contentSearch.toLowerCase())
  );
  const pagedContents = filteredContents.slice(
    (contentPage - 1) * pageSize,
    contentPage * pageSize
  );
  const totalContentPages = Math.ceil(filteredContents.length / pageSize);

  // Schedule Filtering
  const filteredSchedules = schedules.filter(
    (s) =>
      (s.contentName.toLowerCase().includes(scheduleSearch.toLowerCase()) ||
        s.mediaType.toLowerCase().includes(scheduleSearch.toLowerCase())) &&
      (scheduleStatus ? s.status === scheduleStatus : true)
  );

  // Content CRUD
  const handleContentFormChange = (e) => {
    setContentForm({ ...contentForm, [e.target.name]: e.target.value });
  };
  const handleAddContent = () => {
    setEditingContent(null);
    setContentForm({ name: "", mediaType: "video", url: "" });
    setShowContentModal(true);
  };
  const handleEditContent = (content) => {
    setEditingContent(content);
    setContentForm({
      name: content.name,
      mediaType: content.mediaType,
      url: content.url,
    });
    setShowContentModal(true);
  };
  const handleDeleteContent = (id) => {
    setContents(contents.filter((c) => c.id !== id));
  };
  const handleContentSubmit = (e) => {
    e.preventDefault();
    if (!contentForm.name || !contentForm.url) return;
    if (editingContent) {
      setContents(
        contents.map((c) =>
          c.id === editingContent.id
            ? { ...c, ...contentForm }
            : c
        )
      );
    } else {
      setContents([
        ...contents,
        {
          id: Date.now(),
          ...contentForm,
          uploadTime: new Date().toISOString().slice(0, 16).replace("T", " "),
          auditStatus: "pending",
          violationType: "none",
        },
      ]);
    }
    setShowContentModal(false);
  };

  // Schedule CRUD
  const handleScheduleFormChange = (e) => {
    setScheduleForm({ ...scheduleForm, [e.target.name]: e.target.value });
  };
  const handleAddSchedule = () => {
    setEditingSchedule(null);
    setScheduleForm({ contentId: "", startTime: "", endTime: "", status: "Scheduled" });
    setShowScheduleModal(true);
  };
  const handleEditSchedule = (schedule) => {
    setEditingSchedule(schedule);
    setScheduleForm({
      contentId: schedule.contentId,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      status: schedule.status,
    });
    setShowScheduleModal(true);
  };
  const handleDeleteSchedule = (id) => {
    setSchedules(schedules.filter((s) => s.id !== id));
  };
  const handleScheduleSubmit = (e) => {
    e.preventDefault();
    if (!scheduleForm.contentId || !scheduleForm.startTime || !scheduleForm.endTime) return;
    if (new Date(scheduleForm.startTime) >= new Date(scheduleForm.endTime)) return;
    const content = contents.find((c) => c.id === Number(scheduleForm.contentId));
    if (editingSchedule) {
      setSchedules(
        schedules.map((s) =>
          s.id === editingSchedule.id
            ? {
                ...s,
                ...scheduleForm,
                contentName: content.name,
                mediaType: content.mediaType,
              }
            : s
        )
      );
    } else {
      setSchedules([
        ...schedules,
        {
          id: Date.now(),
          ...scheduleForm,
          contentName: content.name,
          mediaType: content.mediaType,
        },
      ]);
    }
    setShowScheduleModal(false);
  };

  // Content Preview Modal
  const [previewContent, setPreviewContent] = useState(null);

  // Helper: find schedule for content
  function getScheduleForContent(schedules, contentId) {
    return schedules.find(s => s.contentId === contentId);
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-6">Content Management</h2>
        {/* Content Management Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Search by name or type"
                value={contentSearch}
                onChange={(e) => setContentSearch(e.target.value)}
                className="border rounded px-4 py-2 w-64"
              />
            </div>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded"
              onClick={handleAddContent}
            >
              + Add New Content
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-3 px-4 text-left">File Name</th>
                  <th className="py-3 px-4 text-left">Upload Time</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-left">Audit Status</th>
                  <th className="py-3 px-4 text-left">Violation Type</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pagedContents.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">
                      No content found.
                    </td>
                  </tr>
                ) : (
                  pagedContents.map((content) => {
                    const schedule = getScheduleForContent(schedules, content.id);
                    const status = schedule ? (schedule.status === "No Scheduled" ? "No Scheduled" : schedule.status) : "No Scheduled";
                    const scheduleName = schedule ? (schedule.status === "No Scheduled" ? "No Scheduled" : schedule.contentName) : "No Scheduled";
                    const showTime = status === "Scheduled";
                    return (
                      <tr key={content.id}>
                        <td className="py-3 px-4">{content.name}</td>
                        <td className="py-3 px-4">{content.uploadTime}</td>
                        <td className="py-3 px-4 capitalize">{content.mediaType}</td>
                        <td className="py-3 px-4 capitalize">{content.auditStatus}</td>
                        <td className="py-3 px-4 capitalize">{content.violationType}</td>
                        <td className="py-3 px-4 space-x-2">
                          <button className="text-blue-500 hover:underline" onClick={() => setPreviewContent(content)}>
                            View
                          </button>
                          <button className="text-green-500 hover:underline" onClick={() => handleEditContent(content)}>
                            Edit
                          </button>
                          <button className="text-red-500 hover:underline" onClick={() => handleDeleteContent(content.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="mt-4 flex justify-center space-x-2">
            <button
              className="px-3 py-1 border rounded"
              disabled={contentPage === 1}
              onClick={() => setContentPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>
            <span className="px-3 py-1">{contentPage} / {totalContentPages}</span>
            <button
              className="px-3 py-1 border rounded"
              disabled={contentPage === totalContentPages}
              onClick={() => setContentPage((p) => Math.min(totalContentPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>

        {/* Content Card Area with Search/Filter Above */}
        <div className="bg-white rounded-lg shadow p-6 mb-10">
          <div className="flex space-x-4 mb-4">
            <input
              type="text"
              placeholder="Search by content name or type"
              value={contentSearch}
              onChange={(e) => setContentSearch(e.target.value)}
              className="border rounded px-4 py-2 w-64"
            />
            <select
              value={scheduleStatus}
              onChange={(e) => setScheduleStatus(e.target.value)}
              className="border rounded px-4 py-2"
            >
              <option value="">All Status</option>
              <option value="Scheduled">Scheduled</option>
              <option value="No Scheduled">No Scheduled</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pagedContents.map((content) => {
              const schedule = getScheduleForContent(schedules, content.id);
              const status = schedule ? (schedule.status === "No Scheduled" ? "No Scheduled" : schedule.status) : "No Scheduled";
              const scheduleName = schedule ? (schedule.status === "No Scheduled" ? "No Scheduled" : schedule.contentName) : "No Scheduled";
              const showTime = status === "Scheduled";
              return (
                <div key={content.id} className="bg-gray-50 border rounded-lg p-6">
                  <div className="font-bold text-xl mb-2">{content.name}</div>
                  <div className="mb-1 text-gray-700">Status: {status}</div>
                  <div className="mb-1 text-gray-700">Schedule: {scheduleName}</div>
                  <div className="mb-1 text-gray-700">Start: {showTime ? schedule.startTime : "-"}</div>
                  <div className="mb-1 text-gray-700">End: {showTime ? schedule.endTime : "-"}</div>
                  <div className="mb-1 text-gray-700">Type: {content.mediaType.charAt(0).toUpperCase() + content.mediaType.slice(1)}</div>
                  <div className="flex space-x-4 mt-2">
                    <button className="text-blue-500 hover:underline" onClick={() => setPreviewContent(content)}>Preview</button>
                    <button className="text-green-500 hover:underline" onClick={() => handleEditSchedule(getScheduleForContent(schedules, content.id) || { contentId: content.id, contentName: content.name, mediaType: content.mediaType, status: "No Scheduled", startTime: "", endTime: "" })}>Edit</button>
                    <button className="text-red-500 hover:underline" onClick={() => handleDeleteContent(content.id)}>Delete</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>


        {/* Content Modal */}
        {showContentModal && (
          <Modal title={editingContent ? "Edit Content" : "Add New Content"} onClose={() => setShowContentModal(false)}>
            <form onSubmit={handleContentSubmit} className="space-y-4">
              <input
                name="name"
                type="text"
                placeholder="File Name"
                value={contentForm.name}
                onChange={handleContentFormChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <select
                name="mediaType"
                value={contentForm.mediaType}
                onChange={handleContentFormChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="video">Video</option>
                <option value="image">Image</option>
              </select>
              <input
                name="url"
                type="text"
                placeholder="URL"
                value={contentForm.url}
                onChange={handleContentFormChange}
                className="w-full border px-3 py-2 rounded"
                required
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowContentModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingContent ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Schedule Modal */}
        {showScheduleModal && (
          <Modal title={editingSchedule ? "Edit Schedule" : "Add New Schedule"} onClose={() => setShowScheduleModal(false)}>
            <form onSubmit={handleScheduleSubmit} className="space-y-4">
              <select
                name="status"
                value={scheduleForm.status}
                onChange={handleScheduleFormChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="Scheduled">Scheduled</option>
                <option value="No Scheduled">No Scheduled</option>
                <option value="Completed">Completed</option>
              </select>
              {scheduleForm.status === "Scheduled" && (
                <>
                  <select
                    name="scheduleId"
                    value={scheduleForm.scheduleId || ""}
                    onChange={handleScheduleFormChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  >
                    <option value="">Select Schedule</option>
                    {schedules.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.contentName} ({s.mediaType})
                      </option>
                    ))}
                  </select>
                  <input
                    name="startTime"
                    type="datetime-local"
                    value={scheduleForm.startTime}
                    onChange={handleScheduleFormChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                  <input
                    name="endTime"
                    type="datetime-local"
                    value={scheduleForm.endTime}
                    onChange={handleScheduleFormChange}
                    className="w-full border px-3 py-2 rounded"
                    required
                  />
                </>
              )}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="px-4 py-2 border rounded"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  {editingSchedule ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </Modal>
        )}

        {/* Preview Modal */}
        {previewContent && (
          <Modal title={previewContent.name} onClose={() => setPreviewContent(null)}>
            {previewContent.mediaType === "image" ? (
              <Image src={previewContent.url} alt={previewContent.name} width={400} height={300} className="w-full max-h-96 object-contain" />
            ) : (
              <video src={previewContent.url} controls className="w-full max-h-96" />
            )}
          </Modal>
        )}
      </div>
    </div>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">{title}</h2>
        {children}
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-400 hover:text-red-500 text-xl font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
} 
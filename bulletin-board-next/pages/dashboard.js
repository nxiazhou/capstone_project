import Sidebar from "../components/Sidebar";
import Link from "next/link";

export default function Dashboard() {
  // Mock stats for demonstration
  const stats = [
    { label: "Total Contents", value: 7, icon: "🎬" },
    { label: "Total Schedules", value: 4, icon: "📅" },
    { label: "Total Users", value: 12, icon: "👤" },
    { label: "Pending Audits", value: 0, icon: "⏳" },
    { label: "Approved Contents", value: 7, icon: "✅" },
    { label: "Rejected Contents", value: 0, icon: "❌" },
  ];
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-8 bg-gradient-to-br from-blue-100 to-indigo-100 min-h-screen flex flex-col">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">Digital Data Distribution Display Platform</h1>
          <p className="text-lg text-gray-700">A unified platform for managing digital content, schedules, and users with intelligent audit and distribution capabilities.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
              <span className="text-4xl mb-2">{stat.icon}</span>
              <div className="text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1">
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-between">
            <span className="text-3xl mb-2">🎬</span>
            <h2 className="font-bold text-lg mb-1">Content Management</h2>
            <p className="text-gray-500 mb-2 text-center">Upload, review, and manage all your media content. Intelligent audit for violation types and status.</p>
            <Link href="/content-management" className="text-blue-600 hover:underline font-semibold">Go to Content</Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-between">
            <span className="text-3xl mb-2">📅</span>
            <h2 className="font-bold text-lg mb-1">Schedule Management</h2>
            <p className="text-gray-500 mb-2 text-center">Plan and control your content display schedules. Flexible time slots and status management.</p>
            <Link href="/schedule-management" className="text-blue-600 hover:underline font-semibold">Go to Schedules</Link>
          </div>
          <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-between">
            <span className="text-3xl mb-2">👤</span>
            <h2 className="font-bold text-lg mb-1">User Management</h2>
            <p className="text-gray-500 mb-2 text-center">Manage platform users, roles, and permissions. Secure and efficient user access control.</p>
            <Link href="/user-management" className="text-blue-600 hover:underline font-semibold">Go to Users</Link>
          </div>
        </div>
        <div className="mt-10 text-center text-gray-400 text-sm">
          &copy; 2024 Digital Data Distribution Display Platform
        </div>
      </div>
    </div>
  );
}
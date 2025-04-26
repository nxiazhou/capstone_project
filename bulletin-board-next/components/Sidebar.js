import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="h-screen w-60 bg-gray-100 flex flex-col p-6 shadow-md">
      <h1 className="text-2xl font-bold text-blue-600 mb-10">Dashboard</h1>
      <nav className="flex flex-col gap-6 text-gray-800">
        <Link href="/dashboard">
          <span className="hover:text-blue-500 cursor-pointer">🏠 Home</span>
        </Link>
        <Link href="/user-management">
          <span className="hover:text-blue-500 cursor-pointer">👤 User Management</span>
        </Link>
        <Link href="/schedule-management">
          <span className="hover:text-blue-500 cursor-pointer">📅 Schedule Management</span>
        </Link>
      </nav>
    </div>
  );
}
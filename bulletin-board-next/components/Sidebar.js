import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Sidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("authRole");
    router.push("/login");
  };

  return (
    <div className="h-screen w-60 bg-gray-100 flex flex-col p-6 shadow-md justify-between">
      {/* Top Section */}
      <div>
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
          <Link href="/content-management">
            <span className="hover:text-blue-500 cursor-pointer">🎬 Content Management</span>
          </Link>
          <Link href="/content-review">
            <span className="hover:text-blue-500 cursor-pointer">🔍 Content Review</span>
          </Link>
          <Link href="/device-management">
            <span className="hover:text-blue-500 cursor-pointer">🖥️ Device Management</span>
          </Link>
          <Link href="/player">
            <span className="hover:text-blue-500 cursor-pointer">▶️ Content Player</span>
          </Link>
        </nav>
      </div>

      {/* Bottom Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-6 text-red-600 hover:text-red-800 font-medium"
      >
        🚪 Logout
      </button>
    </div>
  );
}
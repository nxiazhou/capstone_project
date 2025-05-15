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
      {/* 顶部区域 */}
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
        </nav>
      </div>

      {/* 底部 Logout 按钮 */}
      <button
        onClick={handleLogout}
        className="mt-6 text-red-600 hover:text-red-800 font-medium"
      >
        🚪 Logout
      </button>
    </div>
  );
}
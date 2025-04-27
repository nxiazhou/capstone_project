import Sidebar from "../components/Sidebar";
import { useState } from "react";

export default function Usermanagement() {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [users, setUsers] = useState([]); // 暂时空数据

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };
  
  const handleRoleChange = (e) => {
    setRoleFilter(e.target.value);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-6">User Management</h2>

        {/* 顶部按钮 */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex space-x-4">
            {/* 搜索框 */}
            <input
              type="text"
              placeholder="Search by username or email"
              value={searchKeyword}
              onChange={handleSearchChange}
              className="border rounded px-4 py-2 w-64"
            />

            {/* 角色筛选 */}
            <select
              value={roleFilter}
              onChange={handleRoleChange}
              className="border rounded px-4 py-2"
            >
              <option value="">All Roles</option>
              <option value="Admin">Admin</option>
              <option value="User">User</option>
            </select>
          </div>

          {/* 新增按钮 */}
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded">
            + Add New User
          </button>
        </div>

        {/* 用户列表表格 */}
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Username</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-400">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4">{user.status}</td>
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
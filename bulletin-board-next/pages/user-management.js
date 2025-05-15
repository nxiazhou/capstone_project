import Sidebar from "../components/Sidebar";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Usermanagement() {
  const router = useRouter();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState("");
  const [currentUser, setCurrentUser] = useState({
    username: "",
    email: "",
    phone: "",
    address: ""
  });
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    phone: "",
    address: "",
    password: "",
    companyName: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("authRole");

    if (!token) {
      alert("Please log in first.");
      router.push("/login");
      return;
    }

    setRole(storedRole);

    if (storedRole === "admin") {
      fetch("/api/admin/users?page=0&size=100", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUsers(data.content || []))
        .catch((err) => console.error("Fetch users failed:", err));
    } else {
      fetch("/api/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setCurrentUser(data))
        .catch((err) => console.error("Fetch current user failed:", err));
    }
  }, []);

  const handleSearchChange = (e) => setSearchKeyword(e.target.value);
  const handleRoleChange = (e) => setRoleFilter(e.target.value);

  const filteredUsers = users.filter((user) => {
    const matchesKeyword =
      user.username.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      user.email.toLowerCase().includes(searchKeyword.toLowerCase());
    const matchesRole = roleFilter ? user.role === roleFilter : true;
    return matchesKeyword && matchesRole;
  });

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      username: "",
      email: "",
      role: "user",
      phone: "",
      address: "",
      password: "",
      companyName: ""
    });
    setShowModal(true);
  };

  const openEditModal = (user) => {
    setIsEditing(true);
    setFormData({
      userId: user.userId,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone || "",
      address: user.address || "",
      password: "",
      companyName: user.companyName || ""
    });
    setShowModal(true);
  };

  const handleSubmit = async () => {
  const token = localStorage.getItem("authToken");
  const url = isEditing
    ? `/api/admin/users/${formData.userId}`
    : "/api/admin/users";

  const method = isEditing ? "PUT" : "POST";

  const payload = {
    username: formData.username,
    email: formData.email,
    password: formData.password || undefined, // 添加这个可选逻辑
    contactName: formData.username,
    phone: formData.phone,
    address: formData.address,
    companyName: formData.companyName,
    role: formData.role
  };

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  

  const text = await res.text();
  if (res.ok) {
    alert(isEditing ? "User updated." : "User added.");
    setShowModal(false);
    window.location.reload();
  } else {
    alert("Error: " + text);
    console.error("❌ Update error:", text);
  }
  };

  const handleDelete = async (userId, username, role) => {
    if (role === "admin") {
      alert("Cannot delete admin user.");
      return;
    }

    const token = localStorage.getItem("authToken");
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await res.text();
    if (res.ok) {
      alert("User deleted.");
      setUsers(users.filter((u) => u.userId !== userId));
    } else {
      alert("Delete failed: " + text);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-10">
        <h2 className="text-3xl font-bold mb-6">User Management</h2>

        {role === "admin" && (
          <div className="mb-6 flex justify-between items-center">
            <div className="flex space-x-4">
              <input type="text" placeholder="Search by username or email" value={searchKeyword} onChange={handleSearchChange} className="border rounded px-4 py-2 w-64" />
              <select value={roleFilter} onChange={handleRoleChange} className="border rounded px-4 py-2">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded" onClick={openAddModal}>+ Add New User</button>
          </div>
        )}

        {role === "admin" && filteredUsers.length > 0 && (
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
                {filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    <td className="py-3 px-4">{user.username}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">{user.role}</td>
                    <td className="py-3 px-4">{user.subscriptionStatus}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button className="text-blue-500 hover:underline" onClick={() => openEditModal(user)}>Modify</button>
                      <button className="text-red-500 hover:underline" onClick={() => handleDelete(user.userId, user.username, user.role)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {role === "user" && (
          <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
            <h3 className="text-xl font-bold mb-4">Your Profile</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Username</label>
                <input type="text" value={currentUser.username} readOnly className="w-full border px-3 py-2 rounded bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input type="email" value={currentUser.email} readOnly className="w-full border px-3 py-2 rounded bg-gray-100" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input type="text" value={currentUser.phone || ""} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <input type="text" value={currentUser.address || ""} className="w-full border px-3 py-2 rounded" />
              </div>
              <button type="button" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Save Changes</button>
            </form>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-10">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              <h3 className="text-lg font-bold mb-4">{isEditing ? "Modify User" : "Add New User"}</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Username</label>
                  <input type="text" className="w-full border px-3 py-2 rounded" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" className="w-full border px-3 py-2 rounded" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" placeholder={isEditing ? "Leave blank to keep unchanged" : "Enter password"} className="w-full border px-3 py-2 rounded" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input type="text" className="w-full border px-3 py-2 rounded" value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Role</label>
                  <select className="w-full border px-3 py-2 rounded" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input type="text" className="w-full border px-3 py-2 rounded" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input type="text" className="w-full border px-3 py-2 rounded" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
                </div>
              </form>
              <div className="flex justify-end space-x-2 mt-4">
                <button className="border px-4 py-2 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSubmit}>Submit</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
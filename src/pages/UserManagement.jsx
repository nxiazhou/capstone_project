import React from "react";
import DashboardLayout from "../components/DashboardLayout";

const UserManagement = () => {
  return (
    <DashboardLayout>
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">👥 User Management</h1>
            <p className="text-gray-600 mb-6">Manage platform users, view roles, and edit access permissions.</p>

        {/* 未来可以接入用户表格组件 */}
            <div className="bg-white p-4 rounded shadow">
                <p className="text-gray-500 italic">🚧 User list will appear here (e.g., table, filters, actions)</p>
            </div>
        </div>
    </DashboardLayout>

  );
};

export default UserManagement;
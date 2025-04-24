// src/components/DashboardLayout.jsx
import React from "react";
import Sidebar from "./Sidebar"; // 提取原先 Home.jsx 中的 sidebar

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;

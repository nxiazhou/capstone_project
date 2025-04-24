// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white border-r shadow-md p-4">
      <h2 className="text-2xl font-bold text-blue-700 mb-8">📋 Dashboard</h2>
      <nav className="space-y-4">
        <Link to="/home" className="block text-gray-800 hover:text-blue-600 font-medium">
          🏠 Home
        </Link>
        <Link to="/users" className="block text-gray-800 hover:text-blue-600 font-medium">
          👥 User Management
        </Link>
        <Link to="/schedule" className="block text-gray-800 hover:text-blue-600 font-medium">
          🗓 Schedule Management
        </Link>
      </nav>
    </div>
  );
};

export default Sidebar;

// src/pages/Home.jsx
import React from "react";
import DashboardLayout from "../components/DashboardLayout";

const Home = () => {
  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">🏠 Home</h1>
      <p className="text-gray-600">Welcome to the Admin Dashboard. Use the sidebar to navigate.</p>

      <div className="mt-8 bg-white p-6 rounded shadow">
        <p className="text-gray-500 italic">✨ Dashboard modules or stats can be displayed here.</p>
      </div>
    </DashboardLayout>
  );
};

export default Home;
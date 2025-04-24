// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import UserManagement from "./pages/UserManagement";
import ScheduleManagement from "./pages/ScheduleManagement";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/schedule" element={<ScheduleManagement />} />
      </Routes>
    </Router>
  );
}

export default App;
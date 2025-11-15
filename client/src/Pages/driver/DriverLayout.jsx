// src/pages/driver/DriverLayout.jsx
import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, Car, LogOut, ArrowLeftCircle } from "lucide-react";

export default function DriverLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#0b0b0b] text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-gray-800 flex flex-col p-6">
        <h2 className="text-2xl font-bold text-[#d8c305c5] mb-8">Driver Panel</h2>
        <nav className="flex flex-col space-y-3">
          <button
            onClick={() => navigate("/driver/dashboard")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#d8c305c5]/20 transition font-semibold"
          >
            <LayoutDashboard className="w-5 h-5 text-[#d8c305c5]" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#d8c305c5]/20 transition font-semibold"
          >
            <ArrowLeftCircle className="w-5 h-5 text-[#d8c305c5]" />
            <span>Back to Site</span>
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#d8c305c5] text-black font-semibold py-2 rounded-lg hover:bg-[#b5a004] transition mt-4"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 bg-[#111111]/80 border-b border-gray-800 flex items-center justify-between px-8 sticky top-0 z-20">
          <h1 className="text-xl font-semibold text-[#d8c305c5]">Welcome, Driver</h1>
        </header>

        <div className="flex-1 p-8 overflow-y-auto bg-[#0b0b0b]">
          <Outlet /> {/* ✅ This is where nested driver pages load */}
        </div>
      </main>
    </div>
  );
}

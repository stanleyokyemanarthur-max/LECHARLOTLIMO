// src/pages/driver/DriverLayout.jsx
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  LogOut,
  ArrowLeftCircle,
  Menu,
  X,
} from "lucide-react";

export default function DriverLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const closeSidebar = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <>
      <h2 className="text-2xl font-bold text-[#D4AF37] mb-8">
        Driver Panel
      </h2>

      <nav className="flex flex-col space-y-3">
        <button
          onClick={() => {
            navigate("/driver/dashboard");
            closeSidebar();
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#D4AF37]/20 transition font-semibold"
        >
          <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => {
            navigate("/");
            closeSidebar();
          }}
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#D4AF37]/20 transition font-semibold"
        >
          <ArrowLeftCircle className="w-5 h-5 text-[#D4AF37]" />
          <span>Back to Site</span>
        </button>
      </nav>

      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-semibold py-2 rounded-lg hover:bg-[#b5a004] transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen mt-16 md:mt-20 lg:mt-36 bg-[#0b0b0b] text-white">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#111111] border-r border-gray-800 flex-col p-6">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
    <aside
  className={`fixed top-0 left-0 h-full w-72
  bg-[#111111]
  border-r border-gray-800
  z-50
  flex flex-col
  transform transition-transform duration-300
  lg:hidden
  ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
>
  <div className="flex items-center justify-between p-5 border-b border-gray-800">
    <h2 className="text-2xl font-bold text-[#D4AF37]">
      Driver Panel
    </h2>

    <button onClick={closeSidebar}>
      <X className="w-6 h-6 text-white" />
    </button>
  </div>

  <nav className="flex-1 overflow-y-auto flex flex-col p-4 space-y-3">

    <button
      onClick={() => {
        navigate("/driver/dashboard");
        closeSidebar();
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#D4AF37]/20 transition font-semibold"
    >
      <LayoutDashboard className="w-5 h-5 text-[#D4AF37]" />
      Dashboard
    </button>

    <button
      onClick={() => {
        navigate("/");
        closeSidebar();
      }}
      className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#D4AF37]/20 transition font-semibold"
    >
      <ArrowLeftCircle className="w-5 h-5 text-[#D4AF37]" />
      Back to Site
    </button>

  </nav>

  <div className="mt-auto p-4">
    <button
      onClick={handleLogout}
      className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-semibold py-3 rounded-lg hover:bg-[#b5a004] transition"
    >
      <LogOut className="w-4 h-4" />
      Logout
    </button>
  </div>
</aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
       <header className="sticky top-0 z-30 h-14 lg:h-16 bg-[#111111]/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 lg:px-8">
          <div className="flex items-center gap-3">
            {/* Mobile Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition"
            >
              <Menu className="w-6 h-6 text-[#D4AF37]" />
            </button>

            <h1 className="text-lg md:text-xl font-semibold text-[#D4AF37]">
              Welcome, Driver
            </h1>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#0b0b0b] p-3 sm:p-5 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
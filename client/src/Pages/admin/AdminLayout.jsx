import React, { useState } from "react";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Flag,
  Radio,
  Users,
  Car,
  LogOut,
  ArrowLeftCircle,
  Gift as GiftIcon,
  Menu,
  X,
} from "lucide-react";

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const isActive = (path) => location.pathname.includes(path);

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      label: "Bookings",
      icon: Car,
      path: "/admin/bookings",
    },
    {
      label: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      label: "Cars",
      icon: Car,
      path: "/admin/cars",
    },
    {
      label: "Broadcast",
      icon: Radio,
      path: "/admin/broadcast",
    },
    {
      label: "Rewards",
      icon: GiftIcon,
      path: "/admin/rewards",
    },
    // {
    //   label: "Milestones",
    //   icon: Flag,
    //   path: "/admin/milestones",
    // },
  ];

  return (
    <div className="flex min-h-screen mt-16 md:mt-20 lg:mt-36 bg-[#0b0b0b] text-white">

      {/* ================= MOBILE OVERLAY ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ================= MOBILE SIDEBAR ================= */}
    <aside
  className={`fixed mt-20 top-0 left-0 h-full w-72
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
            Admin Panel
          </h2>

          <button onClick={() => setSidebarOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto flex flex-col p-4 space-y-3">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition font-semibold
                ${
                  isActive(item.path)
                    ? "bg-[#D4AF37]/30"
                    : "hover:bg-[#d8c305c5]/20"
                }`}
              >
                <Icon className="w-5 h-5 text-[#D4AF37]" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              navigate("/");
              setSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-[#d8c305c5]/20 transition font-semibold mt-4"
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

      {/* ================= DESKTOP SIDEBAR ================= */}
      <aside className="hidden lg:flex w-64 bg-[#111111] border-r border-gray-800 flex-col p-6">

        <h2 className="text-2xl font-bold text-[#D4AF37] mb-8">
          Admin Panel
        </h2>

        <nav className="flex flex-col space-y-4">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center gap-3 px-3 py-4 rounded-lg transition font-semibold
                ${
                  isActive(item.path)
                    ? "bg-[#D4AF37]/30"
                    : "hover:bg-[#d8c305c5]/20"
                }`}
              >
                <Icon className="w-5 h-5 text-[#D4AF37]" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-3 px-3 py-4 rounded-lg hover:bg-[#d8c305c5]/20 transition font-semibold mt-3"
          >
            <ArrowLeftCircle className="w-5 h-5 text-[#D4AF37]" />
            Back to Site
          </button>
        </nav>

        <div className="mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#D4AF37] text-black font-semibold py-3 rounded-lg hover:bg-[#b5a004] transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="sticky top-0 z-30 mt-6 h-14 lg:h-16 bg-[#111111]/90 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 lg:px-8">

          <div className="flex items-center gap-3">

            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition"
            >
              <Menu className="w-6 h-6 text-[#D4AF37]" />
            </button>

            <h1 className="text-lg lg:text-xl font-semibold text-[#D4AF37]">
              Welcome, Admin
            </h1>

          </div>

        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto bg-[#0b0b0b] p-3 sm:p-5 lg:p-8">
          <Outlet />
        </div>

      </main>
    </div>
  );
}
// src/pages/admin/AdminDashboard.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const { userInfo } = useSelector((state) => state.auth);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCars: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentBookings: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "https://lecharlotlimo-aucd.onrender.com/api/admin/stats",
          {
            headers: {
              Authorization: `Bearer ${userInfo?.token}`,
            },
          }
        );

        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) fetchStats();
  }, [userInfo]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-[#D4AF37]">
        Loading dashboard...
      </div>
    );
  }

  const cards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "fa-solid fa-users",
      color: "bg-blue-600",
    },
    {
      title: "Total Cars",
      value: stats.totalCars,
      icon: "fa-solid fa-car",
      color: "bg-yellow-600",
    },
    {
      title: "Total Bookings",
      value: stats.totalBookings,
      icon: "fa-solid fa-calendar-check",
      color: "bg-green-600",
    },
    {
      title: "Total Revenue",
      value: `$${Number(stats.totalRevenue).toLocaleString()}`,
      icon: "fa-solid fa-dollar-sign",
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="p-4 sm:p-6">

      {/* Heading */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-6 sm:mb-8">
        Admin Dashboard
      </h1>

      {/* ===================== STATS ===================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 250 }}
            className={`${card.color} rounded-xl shadow-lg p-5 flex items-center gap-4 text-white`}
          >
            <i className={`${card.icon} text-3xl`}></i>

            <div>
              <h2 className="text-sm sm:text-lg font-semibold">
                {card.title}
              </h2>

              <p className="text-2xl font-bold mt-1">
                {card.value}
              </p>
            </div>
          </motion.div>
        ))}

      </div>

      {/* ===================== BOOKINGS ===================== */}

      <div className="mt-10">

        <h2 className="text-xl font-bold text-[#D4AF37] mb-4">
          Recent Bookings
        </h2>

        {/* ================= MOBILE CARDS ================= */}

        <div className="space-y-4 md:hidden">

          {stats.recentBookings?.length > 0 ? (

            stats.recentBookings.slice(0, 5).map((b) => (

              <div
                key={b._id}
                className="bg-[#111111] border border-gray-700 rounded-xl p-4 shadow"
              >

                <div className="flex justify-between items-start">

                  <div>
                    <h3 className="font-semibold text-[#D4AF37]">
                      {b.car?.name}
                    </h3>

                    <p className="text-white mt-1">
                      {b.user?.name}
                    </p>

                    <p className="text-sm text-gray-400 mt-2">
                      {b.pickupLocation}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      b.status === "pending"
                        ? "bg-[#D4AF37] text-yellow-900"
                        : b.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {b.status}
                  </span>

                </div>

                <div className="mt-4 border-t border-gray-700 pt-3 flex justify-between">

                  <span className="text-gray-400">
                    Price
                  </span>

                  <span className="font-bold text-white">
                    ${Number(b.totalPrice).toFixed(2)}
                  </span>

                </div>

              </div>

            ))

          ) : (

            <div className="text-center text-gray-400 py-6">
              No recent bookings found.
            </div>

          )}

        </div>

        {/* ================= TABLET / DESKTOP TABLE ================= */}

        <div className="hidden md:block overflow-x-auto rounded-xl border border-gray-700">

          <table className="min-w-[700px] w-full text-sm">

            <thead className="bg-[#D4AF37] text-black">

              <tr>
                <th className="px-4 py-3 text-left">Car</th>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Pickup</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Price</th>
              </tr>

            </thead>

            <tbody>

              {stats.recentBookings?.length > 0 ? (

                stats.recentBookings.slice(0, 5).map((b) => (

                  <tr
                    key={b._id}
                    className="border-t border-gray-700 hover:bg-gray-800"
                  >
                    <td className="px-4 py-3">
                      {b.car?.name}
                    </td>

                    <td className="px-4 py-3">
                      {b.user?.name}
                    </td>

                    <td className="px-4 py-3">
                      {b.pickupLocation}
                    </td>

                    <td className="px-4 py-3">

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          b.status === "pending"
                            ? "bg-[#D4AF37] text-yellow-900"
                            : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {b.status}
                      </span>

                    </td>

                    <td className="px-4 py-3">
                      ${Number(b.totalPrice).toFixed(2)}
                    </td>

                  </tr>

                ))

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="text-center py-8 text-gray-400"
                  >
                    No recent bookings found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
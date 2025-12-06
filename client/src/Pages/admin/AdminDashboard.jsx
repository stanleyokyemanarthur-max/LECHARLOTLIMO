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
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get("https://lecharlotlimo.onrender.com/api/admin/stats", {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) fetchStats();
  }, [userInfo]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-[#B8860B]">
        Loading dashboard...
      </div>
    );

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
      value: `$${stats.totalRevenue.toLocaleString()}`,
      icon: "fa-solid fa-dollar-sign",
      color: "bg-purple-600",
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-[#B8860B] mb-8">
        Admin Dashboard
      </h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, idx) => (
          <motion.div
            key={idx}
            className={`p-5 rounded-xl shadow-lg flex items-center gap-4 text-white ${card.color}`}
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <i className={`${card.icon} text-3xl`}></i>
            <div>
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Bookings Preview */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4 text-[#B8860B]">
          Recent Bookings
        </h2>
        <table className="min-w-full border border-gray-700 text-sm">
          <thead className="bg-[#B8860B] text-black">
            <tr>
              <th className="px-4 py-2">Car</th>
              <th className="px-4 py-2">User</th>
              <th className="px-4 py-2">Pickup</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentBookings && stats.recentBookings.length > 0 ? (
              stats.recentBookings.slice(0, 5).map((b) => (
                <tr key={b._id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="px-4 py-2">{b.car?.name}</td>
                  <td className="px-4 py-2">{b.user?.name}</td>
                  <td className="px-4 py-2">{b.pickupLocation}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${b.status === "pending"
                          ? "bg-[#B8860B] text-yellow-700"
                          : b.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                    >
                      {b.status}
                    </span>
                  </td>

                  <td className="px-4 py-2">${b.totalPrice.toFixed(2)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-400">
                  No recent bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// src/pages/admin/AdminBookings.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // <-- NEW
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("https://selfless-renewal-production-793e.up.railway.app/api/bookings", {
          headers: { Authorization: `Bearer ${userInfo?.token}` },
        });
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userInfo?.token) fetchBookings();
  }, [userInfo]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(
        `https://selfless-renewal-production-793e.up.railway.app/api/bookings/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${userInfo?.token}` } }
      );

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // 🔍 Filtered bookings based on selected status
  const filteredBookings =
    filter === "all"
      ? bookings
      : bookings.filter((b) => b.status === filter);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-[#B8860B]">
        Loading bookings...
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#B8860B] mb-6">Manage Bookings</h1>

      {/* 🔽 Filter Bar */}
      <div className="flex gap-2 mb-4">
        {["all", "pending", "enroute", "completed", "cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors duration-200 ${
              filter === s
                ? "bg-[#B8860B] text-black"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <table className="min-w-full border border-gray-700 text-sm">
        <thead className="bg-[#B8860B] text-black">
          <tr>
            <th className="px-4 py-2">Car</th>
            <th className="px-4 py-2">User</th>
            <th className="px-4 py-2">Pickup</th>
            <th className="px-4 py-2">Dropoff</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBookings.length > 0 ? (
            filteredBookings.map((b) => (
              <tr
                key={b._id}
                className="border-t border-gray-700 hover:bg-gray-800"
              >
                <td className="px-4 py-2">{b.car?.name}</td>
                <td className="px-4 py-2">{b.user?.name}</td>
                <td className="px-4 py-2">{b.pickupLocation}</td>
                <td className="px-4 py-2">{b.dropoffLocation}</td>
                <td className="px-4 py-2">${b.totalPrice.toFixed(2)}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      b.status === "pending"
                        ? "bg-[#B8860B] text-[#503c08]"
                        : b.status === "cancelled"
                        ? "bg-red-100 text-red-700"
                        : b.status === "enroute"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td className="px-4 py-2">
                  <select
                    value={b.status}
                    onChange={(e) => handleStatusChange(b._id, e.target.value)}
                    className="bg-gray-700 border border-gray-500 rounded p-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="enroute">En Route</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="7"
                className="text-center py-4 text-gray-400 italic"
              >
                No bookings found for this filter.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

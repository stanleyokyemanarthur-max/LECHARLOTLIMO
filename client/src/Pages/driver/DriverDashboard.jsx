// src/pages/driver/DriverDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function DriverDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // 👇 Fetch all bookings (client = single driver)
        const res = await axios.get("https://selfless-renewal-production-793e.up.railway.app/api/bookings");
        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axios.put(`https://selfless-renewal-production-793e.up.railway.app/api/bookings/${id}/status`, {
        status: newStatus,
      });

      // Optimistic UI update
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b))
      );
    } catch (error) {
      console.error("Error updating booking status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white">
        Loading your bookings...
      </div>
    );
  }

  const totalTrips = bookings.length;
  const completedTrips = bookings.filter((b) => b.status === "completed").length;
  const pendingTrips = bookings.filter((b) => b.status === "pending").length;

  return (
    <div>
      {/* Header */}
      <h1 className="text-3xl font-bold text-[#d8c305c5] mb-6">
        Welcome, {userInfo?.name || "Driver"}
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl text-center">
          <h3 className="text-lg text-gray-400">Total Trips</h3>
          <p className="text-3xl font-bold text-[#d8c305c5]">{totalTrips}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl text-center">
          <h3 className="text-lg text-gray-400">Completed</h3>
          <p className="text-3xl font-bold text-green-400">{completedTrips}</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl text-center">
          <h3 className="text-lg text-gray-400">Pending</h3>
          <p className="text-3xl font-bold text-yellow-400">{pendingTrips}</p>
        </div>
      </div>

      {/* Bookings Table */}
      <table className="min-w-full border border-gray-700 text-sm">
        <thead className="bg-[#d8c305c5] text-black">
          <tr>
            <th className="px-4 py-2">Car</th>
            <th className="px-4 py-2">Pickup</th>
            <th className="px-4 py-2">Dropoff</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b) => (
            <tr
              key={b._id}
              className="border-t border-gray-700 hover:bg-gray-800"
            >
              <td className="px-4 py-2">{b.car?.name}</td>
              <td className="px-4 py-2">{b.pickupLocation}</td>
              <td className="px-4 py-2">{b.dropoffLocation}</td>
              <td className="px-4 py-2 capitalize">{b.status}</td>
              <td className="px-4 py-2">
                <select
                  value={b.status}
                  onChange={(e) => handleStatusChange(b._id, e.target.value)}
                  className="bg-gray-700 border border-gray-500 rounded p-1"
                >
                  <option value="pending">Pending</option>
                  <option value="enroute">En Route</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DriverDashboard;

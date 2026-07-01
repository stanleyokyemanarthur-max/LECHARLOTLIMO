// src/pages/driver/DriverDashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function DriverDashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token, userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          "https://lecharlotlimo-aucd.onrender.com/api/bookings/driver",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookings(res.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await axios.put(
        `https://lecharlotlimo-aucd.onrender.com/api/bookings/${id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? res.data : b))
      );
    } catch (error) {
      console.error("STATUS UPDATE FAILED:", error.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-white text-sm sm:text-base">
        Loading your bookings...
      </div>
    );
  }

  const totalTrips = bookings.length;
  const completedTrips = bookings.filter((b) => b.status === "completed").length;
  const pendingTrips = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="px-3 sm:px-0">
      {/* Header */}
      <h1 className="text-2xl sm:text-3xl font-bold text-[#D4AF37] mb-4 sm:mb-6">
        Welcome, {userInfo?.name || "Driver"}
      </h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl text-center">
          <h3 className="text-sm sm:text-lg text-gray-400">Total Trips</h3>
          <p className="text-2xl sm:text-3xl font-bold text-[#D4AF37]">
            {totalTrips}
          </p>
        </div>

        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl text-center">
          <h3 className="text-sm sm:text-lg text-gray-400">Completed</h3>
          <p className="text-2xl sm:text-3xl font-bold text-green-400">
            {completedTrips}
          </p>
        </div>

        <div className="bg-gray-800 p-4 sm:p-6 rounded-xl text-center">
          <h3 className="text-sm sm:text-lg text-gray-400">Pending</h3>
          <p className="text-2xl sm:text-3xl font-bold text-yellow-400">
            {pendingTrips}
          </p>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="w-full overflow-x-auto rounded-lg">
        <table className="min-w-[800px] sm:min-w-[900px] w-full border border-gray-700 text-xs sm:text-sm">
          <thead className="bg-[#D4AF37] text-black">
            <tr>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Car</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Customer</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Phone</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Vehicle</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Pickup</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Dropoff</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Pickup Time</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Status</th>
              <th className="px-2 sm:px-4 py-2 whitespace-nowrap">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr
                key={b._id}
                className="border-t border-gray-700 hover:bg-gray-800"
              >
                <td className="px-2 sm:px-4 py-2">
                  <div className="font-semibold text-xs sm:text-sm">
                    {b.user?.name || "N/A"}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400">
                    {b.car?.name}
                  </div>
                </td>

                <td className="px-2 sm:px-4 py-2">
                  <div className="font-semibold text-xs sm:text-sm">
                    {b.user?.name || "N/A"}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400">
                    {b.user?.email || ""}
                  </div>
                </td>

                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                  {b.user?.phone || "N/A"}
                </td>

                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                  {b.car?.name}
                </td>

                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                  {b.pickupLocation}
                </td>

                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm">
                  {b.dropoffLocation}
                </td>

                <td className="px-2 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">
                  {new Date(b.pickupDate).toLocaleString()}
                </td>

                <td className="px-2 sm:px-4 py-2 capitalize text-xs sm:text-sm">
                  {b.status}
                </td>

                <td className="px-2 sm:px-4 py-2">
                  <select
                    value={b.status}
                    disabled={
                      b.status === "pending" ||
                      b.status === "completed" ||
                      b.status === "cancelled"
                    }
                    onChange={(e) =>
                      handleStatusChange(b._id, e.target.value)
                    }
                    className={`rounded p-1 sm:p-2 border text-xs sm:text-sm min-w-[120px] sm:min-w-[150px]
                      ${
                        b.status === "pending" ||
                        b.status === "completed" ||
                        b.status === "cancelled"
                          ? "bg-gray-600 text-gray-300 cursor-not-allowed border-gray-600"
                          : "bg-gray-700 text-white border-gray-500"
                      }`}
                  >
                    {b.status === "pending" && (
                      <option value="pending">
                        Awaiting Admin Confirmation
                      </option>
                    )}

                    {b.status === "confirmed" && (
                      <>
                        <option value="confirmed">Confirmed</option>
                        <option value="enroute">En Route</option>
                      </>
                    )}

                    {b.status === "enroute" && (
                      <>
                        <option value="enroute">En Route</option>
                        <option value="completed">Completed</option>
                      </>
                    )}

                    {b.status === "completed" && (
                      <option value="completed">Completed</option>
                    )}

                    {b.status === "cancelled" && (
                      <option value="cancelled">Cancelled</option>
                    )}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DriverDashboard;
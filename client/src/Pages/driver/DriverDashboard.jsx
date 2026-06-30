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
            headers: { Authorization: `Bearer ${token}` },
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
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? res.data : b))
      );
    } catch (error) {
      console.error("STATUS UPDATE FAILED:", error);
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
  const completedTrips = bookings.filter(
    (b) => b.status === "completed"
  ).length;
  const pendingTrips = bookings.filter(
    (b) => b.status === "pending"
  ).length;

  return (
    <div className="w-full">
      {/* HEADER */}
      <h1 className="text-3xl font-bold text-[#D4AF37] mb-6">
        Welcome, {userInfo?.name || "Driver"}
      </h1>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 p-6 rounded-xl text-center">
          <h3 className="text-lg text-gray-400">Total Trips</h3>
          <p className="text-3xl font-bold text-[#D4AF37]">
            {totalTrips}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl text-center">
          <h3 className="text-lg text-gray-400">Completed</h3>
          <p className="text-3xl font-bold text-green-400">
            {completedTrips}
          </p>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl text-center">
          <h3 className="text-lg text-gray-400">Pending</h3>
          <p className="text-3xl font-bold text-yellow-400">
            {pendingTrips}
          </p>
        </div>
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="grid gap-3 md:hidden">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4"
          >
            <p className="font-semibold">
              {b.user?.name || "N/A"}
            </p>

            <p className="text-xs text-gray-400">
              {b.car?.name}
            </p>

            <div className="text-sm mt-2 space-y-1 text-gray-300">
              <p>Phone: {b.user?.phone || "N/A"}</p>
              <p>Pickup: {b.pickupLocation}</p>
              <p>Drop: {b.dropoffLocation}</p>
              <p>
                Time:{" "}
                {new Date(b.pickupDate).toLocaleString()}
              </p>
              <p>Status: {b.status}</p>
            </div>

            <select
              value={b.status}
              onChange={(e) =>
                handleStatusChange(b._id, e.target.value)
              }
              className="mt-3 w-full bg-gray-700 border border-gray-500 rounded p-2"
            >
              <option value="pending" disabled>
                Pending
              </option>
              <option value="enroute">En Route</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border border-gray-700 text-sm">
          <thead className="bg-[#D4AF37] text-black">
            <tr>
              <th className="px-4 py-2">Car</th>
              <th className="px-4 py-2">Customer</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Vehicle</th>
              <th className="px-4 py-2">Pickup</th>
              <th className="px-4 py-2">Dropoff</th>
              <th className="px-4 py-2">Pickup Time</th>
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
                <td className="px-4 py-2">
                  <div className="font-semibold">
                    {b.user?.name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {b.car?.name}
                  </div>
                </td>

                <td className="px-4 py-2">
                  <div className="font-semibold">
                    {b.user?.name || "N/A"}
                  </div>
                  <div className="text-xs text-gray-400">
                    {b.user?.email || ""}
                  </div>
                </td>

                <td className="px-4 py-2">
                  {b.user?.phone || "N/A"}
                </td>

                <td className="px-4 py-2">{b.car?.name}</td>
                <td className="px-4 py-2">{b.pickupLocation}</td>
                <td className="px-4 py-2">{b.dropoffLocation}</td>

                <td className="px-4 py-2">
                  {new Date(b.pickupDate).toLocaleString()}
                </td>

                <td className="px-4 py-2 capitalize">
                  {b.status}
                </td>

                <td className="px-4 py-2">
                  <select
                    value={b.status}
                    onChange={(e) =>
                      handleStatusChange(b._id, e.target.value)
                    }
                    className="bg-gray-700 border border-gray-500 rounded p-1"
                  >
                    <option value="pending" disabled>
                      Pending
                    </option>
                    <option value="enroute">En Route</option>
                    <option value="completed">Completed</option>
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
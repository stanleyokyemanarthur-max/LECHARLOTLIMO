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
          `${import.meta.env.VITE_API_URL}/api/bookings/driver`,
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
        `${import.meta.env.VITE_API_URL}/api/bookings/${id}/status`,
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
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 py-4">

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
      <div className="hidden md:block  overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-[900px] w-full text-xs sm:text-sm">
          <thead className="bg-[#D4AF37] text-black">
            <tr>
              <th className="px-3 py-2 whitespace-nowrap">Car</th>
              <th className="px-3 py-2 whitespace-nowrap">Customer</th>
              <th className="px-3 py-2 whitespace-nowrap">Phone</th>
              <th className="px-3 py-2 whitespace-nowrap">Vehicle</th>
              <th className="px-3 py-2 whitespace-nowrap">Pickup</th>
              <th className="px-3 py-2 whitespace-nowrap">
                Trip
              </th>
              <th className="px-3 py-2 whitespace-nowrap">Dropoff</th>
              <th className="px-3 py-2 whitespace-nowrap">Pickup Time</th>
              <div>
                <p className="text-xs text-gray-400">
                  Trip
                </p>

                <p>
                  {b.tripType === "roundTrip"
                    ? "Round Trip"
                    : "One Way"}
                </p>
              </div>
              <th className="px-3 py-2">
                Fare
              </th>
              <th className="px-3 py-2 whitespace-nowrap">Status</th>
              <th className="px-3 py-2 whitespace-nowrap">Action</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr
                key={b._id}
                className="border-t border-gray-700 hover:bg-gray-800"
              >
                <td className="px-3 sm:px-4 py-2">
                  <div className="font-semibold text-xs sm:text-sm">
                    {b.user?.name ||
                      `${b.guest?.firstName || ""} ${b.guest?.lastName || ""}`.trim() ||
                      "Guest"}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400">
                    {b.car?.name}
                  </div>
                </td>

                <td className="px-3 sm:px-4 py-2">
                  <div className="font-semibold text-xs sm:text-sm">
                    {b.user?.name ||
                      `${b.guest?.firstName || ""} ${b.guest?.lastName || ""}`.trim() ||
                      "Guest"}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400">
                    {b.user?.email || b.guest?.email || "N/A"}
                  </div>
                </td>

                <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                  {b.user?.phone || b.guest?.phone || "N/A"}
                </td>

                <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                  {b.car?.name}
                </td>

                <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                  {b.pickupLocation}
                </td>
                <td className="px-3 py-2">
                  {b.tripType === "roundTrip"
                    ? "Round Trip"
                    : "One Way"}
                </td>

                <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm">
                  {b.dropoffLocation}
                </td>
                {b.tripType === "roundTrip" && b.returnTrip && (
                  <div className="mt-2 text-xs text-gray-400">
                    Return:
                    <br />
                    {b.returnTrip.pickupLocation}
                    <br />
                    →
                    <br />
                    {b.returnTrip.dropoffLocation}
                  </div>
                )}

                <td className="px-3 sm:px-4 py-2 text-xs sm:text-sm whitespace-nowrap">
                  {new Date(b.pickupDate).toLocaleString()}
                </td>
                <td className="px-3 py-2 font-semibold text-[#D4AF37]">
                  $
                  {Number(
                    b.pricing?.totalFare ??
                    b.totalPrice ??
                    0
                  ).toFixed(2)}
                </td>
                <div>
                  <p className="text-xs text-gray-400">
                    Fare
                  </p>

                  <p className="text-[#D4AF37] font-semibold">
                    $
                    {Number(
                      b.pricing?.totalFare ??
                      b.totalPrice ??
                      0
                    ).toFixed(2)}
                  </p>
                </div>
                {b.tripType === "roundTrip" && b.returnTrip && (
                  <div>
                    <p className="text-xs text-gray-400">
                      Return Trip
                    </p>

                    <p>{b.returnTrip.pickupLocation}</p>

                    <p>{b.returnTrip.dropoffLocation}</p>

                    <p>
                      {new Date(
                        b.returnTrip.pickupDate
                      ).toLocaleString()}
                    </p>
                  </div>
                )}

                <td className="px-3 sm:px-4 py-2 capitalize text-xs sm:text-sm">
                  {b.status}
                </td>

                <td className="px-3 sm:px-4 py-2">
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
                      ${b.status === "pending" ||
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
      <div className="md:hidden space-y-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3"
          >
            <div>
              <p className="text-xs text-gray-400">Customer</p>
              <p className="font-semibold">{b.user?.name || "N/A"}</p>
              <p className="text-sm text-gray-400">{b.user?.email}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Phone</p>
              <p>{b.user?.phone || "N/A"}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Vehicle</p>
              <p>{b.car?.name}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Pickup</p>
              <p>{b.pickupLocation}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Dropoff</p>
              <p>{b.dropoffLocation}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Pickup Time</p>
              <p>{new Date(b.pickupDate).toLocaleString()}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Status</p>
              <p className="capitalize">{b.status}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-1">Action</p>
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
                className={`w-full rounded p-2 border text-sm ${b.status === "pending" ||
                  b.status === "completed" ||
                  b.status === "cancelled"
                  ? "bg-gray-600 text-gray-300 cursor-not-allowed border-gray-600"
                  : "bg-gray-700 text-white border-gray-500"
                  }`}
              >
                {b.status === "pending" && (
                  <option value="pending">Awaiting Admin Confirmation</option>
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DriverDashboard;
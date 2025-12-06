import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const token = userInfo?.token;

  // 🔄 Fetch bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch("https://lecharlotlimo.onrender.com/api/bookings/my-bookings", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setBookings(data);
      else console.error("Error fetching bookings:", data.message);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchBookings();

    // ⏱ Auto-refresh every 30 seconds
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [token, navigate]);

  // ❌ Cancel booking
  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    setCancelingId(id);
    try {
      const res = await fetch(`https://lecharlotlimo.onrender.com/api/bookings/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        alert("Booking cancelled successfully!");
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "cancelled" } : b))
        );
      } else {
        alert(data.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("An error occurred while cancelling booking.");
    } finally {
      setCancelingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-[70vh] text-white">
        Loading your bookings...
      </div>
    );

  if (!bookings.length)
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-gray-300">
        <p className="text-lg">You have no bookings yet.</p>
        <button
          onClick={() => navigate("/fleet")}
          className="mt-4 bg-[#B8860B] text-white px-5 py-2 rounded-xl hover:bg-[#1f1c01c5] transition"
        >
          Browse Cars
        </button>
      </div>
    );

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      case "confirmed":
        return "text-green-400 bg-green-400/10";
      case "completed":
        return "text-gray-400 bg-gray-400/10";
      case "cancelled":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white font-sans px-[10%] py-14">
      <h1 className="text-4xl font-bold mb-10 font-bricolage text-center">
        My Bookings
      </h1>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {bookings.map((booking, index) => (
          <motion.div
            key={booking._id || index}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="bg-[#1a1a1a] rounded-2xl shadow-lg overflow-hidden border border-[#2a2a2a] hover:shadow-[#d8c305c5]/20 hover:border-[#d8c305c5]/40 transition-all duration-300"
          >
            {/* Car Image */}
            <div className="relative">
              <img
                src={booking.carSnapshot?.image || booking.car?.image}
                alt={booking.carSnapshot?.name || "Car"}
                className="w-full h-52 object-cover"
              />
              <span
                className={`absolute top-3 right-3 px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>

            {/* Booking Info */}
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold font-bricolage">
                  {booking.carSnapshot?.name || booking.car?.name}
                </h2>
                <p className="text-sm text-gray-400">
                  {booking.carSnapshot?.type || booking.car?.type}
                </p>
              </div>

              <div className="text-gray-300 text-sm space-y-2">
                <p>
                  <span className="text-gray-500">Pickup:</span> {booking.pickupLocation}
                </p>
                <p>
                  <span className="text-gray-500">Dropoff:</span> {booking.dropoffLocation}
                </p>
                <p>
                  <span className="text-gray-500">Pickup Date:</span>{" "}
                  {dayjs(booking.pickupDate).format("MMM DD, YYYY h:mm A")}
                </p>
                <p>
                  <span className="text-gray-500">Dropoff Date:</span>{" "}
                  {dayjs(booking.dropoffDate).format("MMM DD, YYYY h:mm A")}
                </p>
                <p>
                  <span className="text-gray-500">Distance:</span>{" "}
                  {booking.distance?.toFixed(1)} miles
                </p>
                <p className="font-semibold text-lg">
                  Total Price:{" "}
                  <span className="text-[#B8860B]">${booking.totalPrice.toFixed(2)}</span>
                </p>
              </div>

              {/* Cancel Button */}
              {booking.status === "pending" && (
                <button
                  onClick={() => cancelBooking(booking._id)}
                  disabled={cancelingId === booking._id}
                  className="w-full mt-4 py-2 bg-red-600/80 hover:bg-red-600 rounded-xl text-white font-semibold transition"
                >
                  {cancelingId === booking._id ? "Cancelling..." : "Cancel Booking"}
                </button>
              )}

              <div className="pt-3 border-t border-gray-700 text-right">
                <p className="text-xs text-gray-500">
                  Booked on {dayjs(booking.createdAt).format("MMM DD, YYYY")}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;

import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const API_BASE = "https://lecharlotlimo-aucd.onrender.com";

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState(null);
  const navigate = useNavigate();

  const { userInfo } = useSelector((state) => state.auth);
  const token = userInfo?.token;

  const fetchBookings = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok) setBookings(data || []);
      else console.error("Error fetching bookings:", data?.message || data);
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
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, [token, navigate]);

  const cancelBooking = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;

    setCancelingId(id);
    try {
      const res = await fetch(`${API_BASE}/api/bookings/${id}/cancel`, {
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
        alert(data?.error || data?.message || "Failed to cancel booking");
      }
    } catch (err) {
      console.error("Cancel error:", err);
      alert("An error occurred while cancelling booking.");
    } finally {
      setCancelingId(null);
    }
  };
  const completePayment = async (bookingId) => {
    try {
      const res = await fetch(
        `${API_BASE}/api/payments/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Unable to start payment.");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  const statusPill = (status) => {
    switch (status) {
      case "awaiting_payment":
        return "text-yellow-300 bg-yellow-400/10 border border-yellow-500/30";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      case "confirmed":
        return "text-green-400 bg-green-400/10";
      case "enroute":
        return "text-blue-400 bg-blue-400/10";
      case "completed":
        return "text-gray-300 bg-gray-400/10";
      case "cancelled":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-300 bg-gray-400/10";
    }
  };

  const paymentPill = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return "text-green-300 bg-green-400/10 border border-green-500/30";
      case "pending":
        return "text-yellow-300 bg-yellow-400/10 border border-yellow-500/30";
      case "refunded":
        return "text-purple-300 bg-purple-400/10 border border-purple-500/30";
      case "cancelled":
        return "text-red-300 bg-red-400/10 border border-red-500/30";
      default:
        return "text-gray-300 bg-gray-400/10 border border-gray-500/30";
    }
  };

  const stateLine = (b) => {
    const pay = b.paymentStatus || "pending";

    // free booking (reward/admin)
    if (b.isPaid === false) {
      if (b.status === "pending") return "Free ✅ awaiting confirmation";
      return "Free booking";
    }

    // paid booking flow
    if (pay === "paid" && b.status === "pending") return "Paid ✅ awaiting confirmation";
    if (
      pay === "awaiting_payment" &&
      b.status === "pending"
    )
      return "Awaiting payment";
    return null;
  };

  const canCancel = (b) => {
    // You currently don't do refunds in cancel route, so avoid letting users cancel paid bookings here.
    const pay = b.paymentStatus || "pending";
    const isFree = b.isPaid === false;
    return b.status === "pending" && (isFree || pay !== "paid");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[70vh] text-white">
        Loading your bookings...
      </div>
    );
  }

  if (!bookings.length) {
    return (
      <div className="flex flex-col justify-center items-center h-[70vh] text-gray-300">
        <p className="text-lg">You have no bookings yet.</p>
        <button
          onClick={() => navigate("/fleet")}
          className="mt-4 bg-[#D4AF37] text-white px-5 py-2 rounded-xl hover:bg-[#1f1c01c5] transition"
        >
          Browse Cars
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-20 bg-[#121212] text-white font-sans px-[10%] py-14">
      <h1 className="text-4xl font-bold pb-10 font-bricolage text-center">
        My Bookings
      </h1>

      <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
        {bookings.map((booking, index) => {
          const pay = booking.paymentStatus || "pending";
          const line = stateLine(booking);

          return (
            <motion.div
              key={booking._id || index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="bg-[#1a1a1a] rounded-2xl shadow-lg overflow-hidden border border-[#2a2a2a] hover:shadow-[#d8c305c5]/20 hover:border-[#d8c305c5]/40 transition-all duration-300"
            >
              {/* Car Image */}
              <div className="relative">
                <img
                  src={booking.carSnapshot?.image || booking.car?.image}
                  alt={booking.carSnapshot?.name || "Car"}
                  className="w-full h-52 object-cover"
                />

                {/* Status + Payment pills */}
                <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${statusPill(booking.status)}`}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                  </span>

                  <span className={`px-3 py-1 text-xs font-semibold rounded-full ${paymentPill(pay)}`}>
                    {pay.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Booking Info */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center gap-3">
                  <h2 className="text-2xl font-bold font-bricolage">
                    {booking.carSnapshot?.name || booking.car?.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {booking.carSnapshot?.type || booking.car?.type}
                  </p>
                </div>

                {/* State line */}
                {line && (
                  <div className="text-sm px-3 py-2 rounded-xl bg-[#0f0f0f] border border-[#2a2a2a] text-[#D4AF37]">
                    {line}
                  </div>
                )}

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
                    <span className="text-[#D4AF37]">
                      ${Number(booking.totalPrice || 0).toFixed(2)}
                    </span>
                  </p>
                </div>

                {/* Cancel Button (only when safe) */}
                {/* Complete Payment */}
                {booking.status === "pending" &&
                  booking.paymentStatus === "awaiting_payment" && (
                    <button
                      onClick={() => completePayment(booking._id)}
                      className="w-full mb-3 py-2 rounded-xl bg-[#D4AF37] text-black font-bold hover:opacity-90 transition"
                    >
                      Complete Payment
                    </button>
                  )}
                {canCancel(booking) && (
                  <button
                    onClick={() => cancelBooking(booking._id)}
                    disabled={cancelingId === booking._id}
                    className="w-full mt-2 py-2 bg-red-600/80 hover:bg-red-600 rounded-xl text-white font-semibold transition"
                  >
                    {cancelingId === booking._id ? "Cancelling..." : "Cancel Booking"}
                  </button>
                )}

                {/* If paid pending, explain why no cancel */}
                {!canCancel(booking) && booking.status === "pending" && pay === "paid" && (
                  <div className="text-xs text-gray-400">
                    This booking is already paid. If you need to cancel, contact support for assistance.
                  </div>
                )}

                <div className="pt-3 border-t border-gray-700 text-right">
                  <p className="text-xs text-gray-500">
                    Booked on {dayjs(booking.createdAt).format("MMM DD, YYYY")}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default MyBookings;

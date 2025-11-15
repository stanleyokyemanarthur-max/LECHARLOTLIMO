import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function Confirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'failed'
  const [booking, setBooking] = useState(null);

  // Extract Stripe session_id from URL
  const query = new URLSearchParams(location.search);
  const sessionId = query.get("session_id");

  useEffect(() => {
    if (!sessionId) {
      setStatus("failed");
      return;
    }

    const verifyPayment = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/payments/verify?session_id=${sessionId}`
        );

        if (res.data.success) {
          setBooking(res.data.booking);
          setStatus("success");

          // Redirect after 3 seconds
          setTimeout(() => navigate("/mybookings"), 3000);
        } else {
          setBooking(res.data.booking);
          setStatus("failed");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("failed");
      }
    };

    verifyPayment();
  }, [sessionId, navigate]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
        <Loader2 className="animate-spin w-12 h-12 text-yellow-400 mb-4" />
        <p>Verifying your payment...</p>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
        <p className="text-lg mb-4">❌ Payment verification failed.</p>
        <button
          onClick={() => navigate("/")}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-6 rounded-full"
        >
          Go Home
        </button>
      </div>
    );
  }

  // Success screen
  return (
    <motion.div
      className="min-h-screen flex flex-col justify-center items-center bg-black text-white text-center px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <CheckCircle2 className="text-green-500 w-16 h-16 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
      <p className="text-gray-300 mb-6">
        Thank you for choosing Le Charlot Limousine. Your ride is confirmed and ready.
      </p>

      {booking && (
        <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg text-left w-full max-w-md">
          <p><strong>Booking ID:</strong> {booking._id}</p>
          <p><strong>Car:</strong> {booking.car?.name || "—"}</p>
          <p><strong>Pickup:</strong> {booking.pickupLocation}</p>
          <p><strong>Drop-off:</strong> {booking.dropoffLocation}</p>
          <p><strong>Total:</strong> ${booking.totalPrice}</p>
          <p className="text-green-400 mt-2 font-semibold">Status: {booking.paymentStatus}</p>

          {/* Passenger info: logged-in or guest */}
          <div className="mt-4">
            <h3 className="font-bold text-lg mb-2">Passenger Info</h3>
            {booking.user ? (
              <p>{booking.user.firstName} {booking.user.lastName} ({booking.user.email})</p>
            ) : booking.guest ? (
              <p>{booking.guest.firstName} {booking.guest.lastName} ({booking.guest.email})</p>
            ) : (
              <p>N/A</p>
            )}
          </div>
        </div>
      )}

      <p className="text-gray-400 mt-8">Redirecting to My Bookings...</p>
    </motion.div>
  );
}

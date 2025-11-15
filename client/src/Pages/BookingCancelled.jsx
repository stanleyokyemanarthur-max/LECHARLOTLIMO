import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { XCircle, ArrowLeft } from "lucide-react";

function BookingCancelled() {
  const navigate = useNavigate();
  const location = useLocation();
  const sessionId = new URLSearchParams(location.search).get("session_id");

  useEffect(() => {
    if (sessionId) {
      fetch(`http://localhost:5000/api/payments/cancel?session_id=${sessionId}`).catch(() =>
        console.warn("Failed to update booking status")
      );
    }
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-lg w-full"
      >
        <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          Your payment was not completed. No booking has been confirmed yet.
        </p>

        <button
          onClick={() => navigate("/mybookings")}
          className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
        >
          <ArrowLeft className="w-5 h-5" /> Back to My Bookings
        </button>
      </motion.div>
    </div>
  );
}

export default BookingCancelled;

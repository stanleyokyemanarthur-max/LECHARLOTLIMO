import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Home, XCircle } from "lucide-react";
import { API_ORIGIN } from "../config/api";
import { clearBookingDraft } from "../utils/bookingDraft";
import { findPaidBooking } from "../utils/bookingPayment";
import { useSelector } from "react-redux";

const API_BASE = API_ORIGIN;

function BookingSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const [verified, setVerified] = useState(null);
  const [bookingStatus, setBookingStatus] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const params = new URLSearchParams(location.search);
  const sessionId = params.get("session_id");
  const paymentSource = params.get("source");
  const bookingId = params.get("bookingId");

  useEffect(() => {
    window.scrollTo(0, 0);

    let cancelled = false;

    if (paymentSource === "paypal" && bookingId && token) {
      fetch(`${API_BASE}/api/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Unable to verify PayPal booking");
          return res.json();
        })
        .then((bookings) => {
          if (cancelled) return;
          const booking = findPaidBooking(bookings, bookingId);
          if (booking) {
            clearBookingDraft();
            setBookingStatus(booking.status || "pending");
            setVerified(true);
          } else {
            setVerified(false);
          }
        })
        .catch(() => {
          if (!cancelled) setVerified(false);
        });

      return () => {
        cancelled = true;
      };
    }

    if (sessionId) {
      fetch(`${API_BASE}/api/payments/verify?session_id=${sessionId}`)
        .then((res) => res.json())
        .then((data) => {
          if (cancelled) return;
          if (data?.paid) {
            clearBookingDraft();
            setVerified(true);
            setBookingStatus(data?.bookingStatus || "pending");
          } else {
            setVerified(false);
          }
        })
        .catch(() => {
          if (!cancelled) setVerified(false);
        });
    } else {
      setVerified(false);
    }

    return () => {
      cancelled = true;
    };
  }, [bookingId, paymentSource, sessionId, token]);

  if (verified === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Verifying your payment...
      </div>
    );
  }

  if (!verified) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-2xl shadow-xl p-10 text-center max-w-lg w-full"
        >
          <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Incomplete</h1>
          <p className="text-gray-600 mb-6">
            It looks like your payment didn’t go through successfully.
          </p>

          <button
            onClick={() => navigate("/mybookings")}
            className="flex items-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
          >
            Go to My Bookings
          </button>
        </motion.div>
      </div>
    );
  }

  // ✅ New messaging: payment received, may still be awaiting confirmation
  const title =
    bookingStatus === "confirmed" ? "Booking Confirmed!" : "Payment Received ✅";

  const desc =
    bookingStatus === "confirmed"
      ? "Your booking has been confirmed by our dispatch team."
      : "We’ve received your payment. Your booking is now awaiting confirmation from our dispatch team.";

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center px-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-2xl rounded-2xl p-10 max-w-lg w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
          className="flex justify-center"
        >
          <CheckCircle2 className="text-green-500 w-20 h-20 mb-4" />
        </motion.div>

        <h1 className="text-3xl font-bold text-gray-800 mb-3">{title}</h1>

        <p className="text-gray-600 mb-6">
          Thank you for choosing{" "}
          <span className="font-semibold text-black">Le Charlot Limousine</span>.
          <br />
          {desc}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/mybookings")}
            className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200"
          >
            View My Bookings <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-center gap-2 bg-white text-gray-800 border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-200"
          >
            <Home className="w-5 h-5" /> Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default BookingSuccess;

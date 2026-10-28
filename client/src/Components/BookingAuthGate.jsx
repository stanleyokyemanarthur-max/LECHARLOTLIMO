import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { loadBookingDraft, saveBookingDraft } from "../utils/bookingDraft";

export default function BookingAuthGate({ children }) {
  const { token, userInfo, status } = useSelector((state) => state.auth);
  const { tripData, selectedCar, estimate } = useSelector(
    (state) => state.bookings,
  );
  const location = useLocation();
  const navigate = useNavigate();
  const redirected = useRef(false);
  const [draftError, setDraftError] = useState("");

  useEffect(() => {
    if (token && userInfo?.role === "customer") return;
    if (token && userInfo && userInfo.role !== "customer") {
      navigate("/", { replace: true });
      return;
    }
    if (token && !userInfo && status !== "failed") return;
    if (redirected.current) return;

    const bookingState = location.state || {};
    const draftTrip = bookingState.rideInfo || tripData;
    if (draftTrip) {
      try {
        saveBookingDraft({
          tripData: draftTrip,
          step:
            location.pathname === "/final-details"
              ? "final-details"
              : location.pathname === "/select-car"
                ? "select-car"
                : "reserve",
          selectedCarId:
            bookingState.selectedCar?._id || selectedCar?._id || null,
          estimate: bookingState.estimate || estimate,
        });
      } catch {
        setDraftError(
          "Your booking details could not be saved. Keep this page open while you sign in.",
        );
        return;
      }
    } else if (!loadBookingDraft()) {
      setDraftError(
        "Start a reservation before continuing to vehicle selection or payment.",
      );
      return;
    }

    redirected.current = true;
    navigate("/login", {
      replace: true,
      state: { bookingAuthRequired: true },
    });
  }, [
    estimate,
    location.pathname,
    location.state,
    navigate,
    selectedCar,
    status,
    token,
    tripData,
    userInfo,
  ]);

  if (token && userInfo?.role === "customer") return children;
  if (token && !userInfo && status !== "failed") {
    return <p className="p-6 text-center text-[#D4AF37]">Checking your account…</p>;
  }
  if (token && userInfo && userInfo.role !== "customer") {
    return <p className="p-6 text-center text-gray-300">Customer account required.</p>;
  }
  if (draftError) {
    return (
      <div className="min-h-[50vh] p-8 text-center text-white">
        <p role="alert">{draftError}</p>
        <button
          className="mt-4 text-[#D4AF37] underline"
          onClick={() => navigate("/reserve")}
        >
          Return to reservation
        </button>
      </div>
    );
  }
  return <p className="p-6 text-center text-[#D4AF37]">Taking you to sign in…</p>;
}

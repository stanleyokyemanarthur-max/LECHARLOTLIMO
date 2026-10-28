import React, { useEffect, useState } from "react";
import { API_ORIGIN } from "../config/api";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import PayPalButton from "../Components/PayPalButtons";
import { logout } from "../slices/authSlice";
import {
  loadBookingDraft,
  saveBookingDraft,
} from "../utils/bookingDraft";

function FinalDetails() {
  const [bookingId, setBookingId] = useState(null);
  const [bookingReady, setBookingReady] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const bookingFlow = useSelector((state) => state.bookings);
  const rideInfo = location.state?.rideInfo || bookingFlow.tripData;
  const selectedCar = location.state?.selectedCar || bookingFlow.selectedCar;
  const estimate = location.state?.estimate || bookingFlow.estimate;

  const outboundEstimate = estimate?.outbound || {};
  const returnEstimate = estimate?.return || {};
  const outboundFare = Number(outboundEstimate.estimatedPrice || 0);
  const returnFare = Number(returnEstimate.estimatedPrice || 0);

  const { userInfo: user, token: authToken } = useSelector(
    (state) => state.auth,
  );
  const [loading, setLoading] = useState(false);
  const [finalQuote, setFinalQuote] = useState(null);
  const totalDistance =
    Number(outboundEstimate.distanceMiles || 0) +
    Number(returnEstimate.distanceMiles || 0);

  const totalDuration =
    Number(outboundEstimate.durationMinutes || 0) +
    Number(returnEstimate.durationMinutes || 0);

  const isRoundTrip =
    estimate?.tripType === "roundTrip" ||
    rideInfo?.tripType === "roundTrip";

  useEffect(() => {
    if (rideInfo && selectedCar) return;
    navigate(
      bookingFlow.tripData || loadBookingDraft()
        ? "/select-car"
        : "/reserve",
      {
      replace: true,
      },
    );
  }, [bookingFlow.tripData, navigate, rideInfo, selectedCar]);


  if (!rideInfo || !selectedCar) {
    return (
      <div className="text-white flex items-center justify-center h-screen bg-black text-center p-4">
        <p>Restoring your reservation details…</p>
      </div>
    );
  }
  const estimatedTotal = Number(
    estimate?.totalPrice ??
    outboundFare + returnFare
  );

  const displayTotal =
    Number(finalQuote?.pricing?.totalFare) || estimatedTotal;
  const displayOutboundFare = Number(
    finalQuote?.pricing?.outboundFare ?? outboundFare
  );
  const displayReturnFare = Number(
    finalQuote?.pricing?.returnFare ?? returnFare
  );
  const displayOutboundDistance = Number(
    finalQuote?.pricing?.outboundDistance ?? outboundEstimate.distanceMiles ?? 0
  );
  const displayReturnDistance = Number(
    finalQuote?.pricing?.returnDistance ?? returnEstimate.distanceMiles ?? 0
  );
  const displayDistance = Number(finalQuote?.totalDistance ?? totalDistance);

  const resumeAfterExpiredAuth = () => {
    try {
      saveBookingDraft({
        tripData: rideInfo,
        step: "final-details",
        selectedCarId: selectedCar?._id,
        estimate,
      });
    } catch (draftError) {
      toast.error(draftError.message || "Booking details could not be saved.");
      return;
    }
    dispatch(logout());
    navigate("/login", {
      replace: true,
      state: { bookingAuthRequired: true },
    });
  };

  // 🔹 Save booking & redirect to Stripe checkout
  const handleBookingConfirm = async () => {
    try {
      setLoading(true);

      if (
        !rideInfo.pickupLocation ||
        !rideInfo.dropoffLocation ||
        Number(outboundEstimate.distanceMiles || 0) <= 0
      ) {
        alert("Incomplete ride information.");
        return;
      }

      if (!selectedCar?._id) {
        alert("No car selected.");
        return;
      }

      const bookingPayload = {
        car: selectedCar._id,

        pickupIsAirport: rideInfo.pickupIsAirport || false,
        dropoffIsAirport: rideInfo.dropoffIsAirport || false,

        pickupLocation: rideInfo.pickupLocation,
        dropoffLocation: rideInfo.dropoffLocation,
        flightNumber: rideInfo.flightNumber || null,


        pickupDate: rideInfo.pickupDate
          ? new Date(rideInfo.pickupDate).toISOString()
          : null,

        dropoffDate: rideInfo.dropoffDate
          ? new Date(rideInfo.dropoffDate).toISOString()
          : null,

        passengers: rideInfo.passengers || 1,
        luggage: rideInfo.luggage || 0,

        tripType: rideInfo.tripType || "oneWay",
        returnTrip: isRoundTrip
          ? {
            pickupLocation: rideInfo.returnPickupLocation,
            dropoffLocation: rideInfo.returnDropoffLocation,
            pickupIsAirport: rideInfo.returnPickupIsAirport || false,
            dropoffIsAirport: rideInfo.returnDropoffIsAirport || false,
            pickupDate: rideInfo.returnDate
              ? new Date(rideInfo.returnDate).toISOString()
              : null,

            dropoffDate: rideInfo.returnDate
              ? new Date(
                new Date(rideInfo.returnDate).getTime() +
                (returnEstimate.durationMinutes || 0) * 60000
              ).toISOString()
              : null,

            flightNumber: rideInfo.returnFlightNumber || null,
          }
          : null,
      };


      const headers = { Authorization: `Bearer ${authToken}` };

      // CREATE BOOKING
      const bookingRes = await axios.post(

        `${API_ORIGIN}/api/bookings`,
        bookingPayload,
        { headers }


      );


      const booking = bookingRes.data.booking;


      // FINALIZE BACKEND PRICE
      const quoteRes = await axios.post(
        `${API_ORIGIN}/api/bookings/finalize-quote`,
        {
          bookingId: booking._id,
        },
        { headers }
      );


      setFinalQuote(quoteRes.data.quote);
      setBookingId(booking._id);
      setBookingReady(true);


      toast.success(
        "Booking confirmed. Choose your payment method below."
      );


    } catch (err) {

      console.error("Booking request failed:", err.message);

      if (err.response?.status === 401) {
        resumeAfterExpiredAuth();
        return;
      }

      // EXISTING PAYMENT / BOOKING RESUME
      if (err.response?.data?.resumePayment) {

        try {

          const booking = err.response.data.booking;


          const headers = { Authorization: `Bearer ${authToken}` };


          const quoteRes = await axios.post(
            `${API_ORIGIN}/api/bookings/finalize-quote`,
            {
              bookingId: booking._id,
            },
            { headers }
          );


          setFinalQuote(quoteRes.data.quote);
          setBookingId(booking._id);
          setBookingReady(true);


          toast.info(
            "Existing booking found. Choose your payment method below."
          );


          return;


        } catch (paymentErr) {

          console.error("Booking quote could not be resumed:", paymentErr.message);

          if (paymentErr.response?.status === 401) {
            resumeAfterExpiredAuth();
            return;
          }

          toast.error(
            "Unable to resume payment."
          );

          return;
        }
      }


      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message;


      if (errorMessage === "CAR_UNAVAILABLE") {

        toast.error(
          "Sorry, all vehicles of this model are reserved for the selected time."
        );

      } else {

        toast.error(
          errorMessage || "Booking failed."
        );
      }


    } finally {

      setLoading(false);

    }
  };
  const handleStripePayment = async () => {
    try {
      const headers = { Authorization: `Bearer ${authToken}` };

      const stripeRes = await axios.post(
        `${API_ORIGIN}/api/payments/create-checkout-session`,
        {
          bookingId,
        },
        { headers }
      );

      window.location.href = stripeRes.data.url;
    } catch (err) {
      console.error("Stripe checkout request failed:", err.message);
      if (err.response?.status === 401) {
        resumeAfterExpiredAuth();
        return;
      }
      toast.error("Unable to start Stripe checkout.");
    }
  };

  return (
    <main className="lc-booking-page min-h-screen text-white">
      <div className="mx-auto max-w-7xl">
      <p className="lc-kicker">Final step · Secure checkout</p>
      <h1 className="lc-booking-intro !w-auto mb-2 text-3xl font-semibold">
        Final Details
      </h1>

      <p className="mb-6 text-gray-400">
        {isRoundTrip
          ? "Round Trip Reservation"
          : "One Way Reservation"}
      </p>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Ride Summary */}
        <div className="overflow-hidden border border-white/10 border-t-2 border-t-[#c8a86a] bg-[#121211]">

          {/* CAR IMAGE HERO */}
          <div className="relative h-[420px] w-full">
            <img
              src={selectedCar.image}
              alt={`${selectedCar.name} selected for your reservation`}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover scale-105"
            />

            {/* DARK GRADIENT OVERLAY */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />

            {/* CAR INFO OVERLAY */}
            <div className="absolute bottom-0 p-6 w-full">
              <h2 className="text-3xl font-bold text-white">
                {selectedCar.name}
              </h2>

              <p className="text-gray-300 text-sm mt-1">
                {selectedCar.type} • {selectedCar.transmission} • {selectedCar.seats} Seats
              </p>

              <div className="flex gap-3 mt-3">
                <span className="px-3 py-1 bg-[#D4AF37]/20 text-[#D4AF37] rounded-full text-xs">
                  Luxury Chauffeur
                </span>

                <span className="px-3 py-1 bg-white/10 text-white rounded-full text-xs">
                  Premium Comfort
                </span>
              </div>
            </div>
          </div>

          {/* PRICING STRIP */}
          <div className="p-6 flex items-end justify-between">
            <div>
              <p className="text-gray-400 text-sm">
                {finalQuote ? "Final Total" : "Estimated Total"}
              </p>

              <p className="text-4xl font-bold text-[#D4AF37]">
                ${Number(displayTotal).toFixed(2)}
              </p>

              {isRoundTrip && (
                <div className="mt-4 text-sm space-y-1 text-gray-400">
                  <div className="flex justify-between gap-10">
                    <span>Outbound</span>
                    <span className="text-white">
                      ${displayOutboundFare.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-10">
                    <span>Return</span>
                    <span className="text-white">
                      ${displayReturnFare.toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-right text-xs text-gray-400 space-y-2">

              <div>
                <p className="text-[#D4AF37] font-semibold">Outbound</p>

                <p>
                  Distance: {displayOutboundDistance.toFixed(2)} mi
                </p>

                <p>
                  Base: $
                  {Number(outboundEstimate.basePrice || 0).toFixed(2)}
                </p>

                <p>
                  Duration: {outboundEstimate.durationText || "--"}
                </p>

                <p>
                  With Traffic: {outboundEstimate.trafficDurationText || "--"}
                </p>

                <p className="text-white font-semibold">
                  Total: $
                  {displayOutboundFare.toFixed(2)}
                </p>
              </div>

              {isRoundTrip && (
                <div className="pt-3 border-t border-[#333]">

                  <p className="text-[#D4AF37] font-semibold">
                    Return
                  </p>

                  <p>
                    <strong>Return Distance:</strong>{" "}
                    {displayReturnDistance.toFixed(2)} mi
                  </p>

                  <hr className="border-[#2a2a2a] my-3" />
                  <p>
                    <strong>Total Distance:</strong>{" "}
                    {displayDistance.toFixed(2)} mi
                  </p>

                  <p>
                    <strong>Total Duration:</strong>{" "}
                    {Math.floor(totalDuration / 60)} hr{" "}
                    {totalDuration % 60} min
                  </p>

                  <p>
                    Base: $
                    {Number(returnEstimate.basePrice || 0).toFixed(2)}
                  </p>

                  <p>
                    Duration: {returnEstimate.durationText || "--"}
                  </p>

                  <p>
                    With Traffic: {returnEstimate.trafficDurationText || "--"}
                  </p>

                  <p className="text-white font-semibold">
                    Total: $
                    {displayReturnFare.toFixed(2)}
                  </p>

                </div>
              )}

            </div>
          </div>
        </div>
        {/* LEFT SIDE - HERO CAR */}
        <div className="space-y-6">

          {/* RIDE INFO */}
          {/* RIDE INFO */}
          <div className="bg-[#141414] p-6 rounded-2xl border border-[#2a2a2a]">
            <h3 className="text-lg font-semibold mb-4 text-[#D4AF37]">
              Trip Summary
            </h3>

            <div className="space-y-2 text-sm text-gray-300">

              <p>
                <strong>Pickup:</strong> {rideInfo.pickupLocation}
              </p>

              <p>
                <strong>Drop-off:</strong> {rideInfo.dropoffLocation}
              </p>

              <p>
                <strong>Pickup Date:</strong>{" "}
                {new Date(rideInfo.pickupDate).toLocaleString()}
              </p>

              {isRoundTrip && (
                <>
                  <p>
                    <strong>Return Pickup:</strong>{" "}
                    {rideInfo.returnPickupLocation}
                  </p>

                  <p>
                    <strong>Return Drop-off:</strong>{" "}
                    {rideInfo.returnDropoffLocation}
                  </p>

                  <p>
                    <strong>Return Date:</strong>{" "}
                    {new Date(rideInfo.returnDate).toLocaleString()}
                  </p>

                  <p>
                    <strong>Return Distance:</strong>{" "}
                    {displayReturnDistance.toFixed(2)} mi
                  </p>
                </>
              )}

              <hr className="border-[#2a2a2a] my-3" />

              <p>
                <strong>Passengers:</strong> {rideInfo.passengers || 1}
              </p>

              <p>
                <strong>Luggage:</strong> {rideInfo.luggage || 0}
              </p>
              <p>
                <strong>
                  {isRoundTrip ? "Outbound Distance" : "Trip Distance"}:
                </strong>{" "}
                {displayOutboundDistance.toFixed(2)} mi
              </p>

            </div>
          </div>

          {/* PASSENGER INFO */}
          <div className="bg-[#141414] p-6 rounded-2xl border border-[#2a2a2a]">
            <h3 className="text-lg font-semibold mb-4 text-[#D4AF37]">
              Passenger Details
            </h3>

            {user ? (
              <div className="space-y-2 text-sm text-gray-300">
                <p>{user.firstName} {user.lastName}</p>
                <p>{user.email}</p>
                <p>{user.phone}</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Sign in to your customer account to complete this booking.
              </p>
            )}
          </div>

          {/* Confirm Booking Button */}
          {!bookingReady && (
            <button
              type="button"
              onClick={() => handleBookingConfirm()}
              disabled={loading}
              aria-busy={loading}
              className="lc-button min-h-14 w-full rounded-sm disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Finalizing Payment..." : "Confirm Booking"}
            </button>
          )}

          {/* Payment Options */}
          {bookingReady && (
            <div className="mt-6 space-y-4">
              <h3 className="text-lg font-semibold text-[#D4AF37]">
                Choose Payment Method
              </h3>

              <button
                type="button"
                onClick={handleStripePayment}
                className="min-h-14 w-full rounded-sm border border-[#635BFF] bg-[#635BFF] px-5 py-4 font-semibold text-white transition hover:bg-[#5149e6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Pay with Stripe
              </button>
              <div className="mt-8">
                <PayPalButton
                  amount={displayTotal}
                  bookingId={bookingId}
                  token={authToken}
                  onAuthExpired={resumeAfterExpiredAuth}
                />
              </div>
            </div>
          )}

        </div>



      </div>
      </div>
    </main>
  );
}

export default FinalDetails;

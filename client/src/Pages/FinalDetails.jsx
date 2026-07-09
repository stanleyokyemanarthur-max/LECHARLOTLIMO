import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import PayPalButton from "../Components/PayPalButtons";

function FinalDetails() {
  const [bookingId, setBookingId] = useState(null);
  const [bookingReady, setBookingReady] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { rideInfo, selectedCar, estimate } = location.state || {};

  const user = useSelector((state) => state.auth.userInfo);
  const [loading, setLoading] = useState(false);
  const [finalQuote, setFinalQuote] = useState(null);


  if (!rideInfo || !selectedCar) {
    return (
      <div className="text-white flex items-center justify-center h-screen bg-black text-center p-4">
        <p>No booking details found. Please start your reservation again.</p>
      </div>
    );
  }

  const estimatedTotal =
    estimate?.TotalPrice ??
    (
      (estimate?.outbound?.TotalPrice || 0) +
      (estimate?.return?.TotalPrice || 0)
    );

  const displayTotal =
    finalQuote?.pricing?.totalFare ??
    estimatedTotal;
  console.log("Estimate:", estimate);

  // 🔹 Save booking & redirect to Stripe checkout
  const handleBookingConfirm = async (guestInfo = null) => {
    try {
      setLoading(true);

      if (
        !rideInfo.pickupLocation ||
        !rideInfo.dropoffLocation ||
        rideInfo.distance == null
      ) {
        alert("Incomplete ride information.");
        return;
      }

      if (!selectedCar?._id) {
        alert("No car selected.");
        return;
      }

      const bookingPayload = {
        user: user?._id || undefined,
        guest: guestInfo || undefined,

        car: selectedCar._id,

        carSnapshot: {
          name: selectedCar.name,
          type: selectedCar.type || "",
          pricePerMile: Number(selectedCar.perMileRate) || 0,
          rateMultiplier: Number(selectedCar.rateMultiplier) || 1,
          totalUnits: Number(selectedCar.totalUnits) || 1,
          fleetKey: selectedCar.fleetKey || null,
        },

        pickupLocation: rideInfo.pickupLocation,
        dropoffLocation: rideInfo.dropoffLocation,

        pickupDate: rideInfo.pickupDate
          ? new Date(rideInfo.pickupDate).toISOString()
          : null,

        dropoffDate: rideInfo.dropoffDate
          ? new Date(rideInfo.dropoffDate).toISOString()
          : null,

        passengers: rideInfo.passengers || 1,
        luggage: rideInfo.luggage || 0,

        distance: Number(rideInfo.distance || 0),

        status: "pending",

        pricing: {
          outboundFare: estimate?.outbound?.TotalPrice || 0,
          returnFare: estimate?.return?.TotalPrice || 0,

          outboundDistance: rideInfo.distance || 0,

          returnDistance:
            rideInfo.tripType === "roundTrip"
              ? rideInfo.returnTrip?.distance || 0
              : 0,
        },

        tripType: rideInfo.tripType || "oneWay",

        returnTrip:
          rideInfo.tripType === "roundTrip"
            ? rideInfo.returnTrip
            : null,
      };


      const headers = user?.token
        ? {
          Authorization: `Bearer ${user.token}`,
        }
        : {};


      // CREATE BOOKING
      const bookingRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        bookingPayload,
        { headers }
      );


      const booking = bookingRes.data.booking;


      // FINALIZE BACKEND PRICE
      const quoteRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings/finalize-quote`,
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

      console.error(
        err.response?.data || err.message
      );


      // EXISTING PAYMENT / BOOKING RESUME
      if (err.response?.data?.resumePayment) {

        try {

          const booking = err.response.data.booking;


          const headers = user?.token
            ? {
              Authorization: `Bearer ${user.token}`,
            }
            : {};


          const quoteRes = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/bookings/finalize-quote`,
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

          console.error(paymentErr);

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
      const headers = user?.token
        ? {
          Authorization: `Bearer ${user.token}`,
        }
        : {};

      const stripeRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments/create-checkout-session`,
        {
          bookingId,
        },
        { headers }
      );

      window.location.href = stripeRes.data.url;
    } catch (err) {
      console.error(err);
      toast.error("Unable to start Stripe checkout.");
    }
  };

  const handleGuestSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const guestInfo = {
      firstName: formData.get("firstName"),
      lastName: formData.get("lastName"),
      phone: formData.get("phone"),
      email: formData.get("email"),
    };
    handleBookingConfirm(guestInfo);
  };

  return (
    <div className="min-h-screen bg-black mt-10 text-white px-[8%] pt-12 py-12">
      <h2 className="text-3xl font-semibold mb-6">Final Details</h2>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Ride Summary */}
        <div className="bg-[#0f0f0f] rounded-3xl overflow-hidden border border-[#2a2a2a] shadow-[0_0_60px_rgba(212,175,55,0.12)]">

          {/* CAR IMAGE HERO */}
          <div className="relative h-[420px] w-full">
            <img
              src={selectedCar.image}
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

              {rideInfo.tripType === "roundTrip" && (
                <div className="mt-4 text-sm space-y-1 text-gray-400">
                  <div className="flex justify-between gap-10">
                    <span>Outbound</span>
                    <span className="text-white">
                      ${Number(estimate?.outbound?.TotalPrice || 0).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between gap-10">
                    <span>Return</span>
                    <span className="text-white">
                      ${Number(estimate?.return?.TotalPrice || 0).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="text-right text-xs text-gray-400 space-y-2">

              <div>
                <p className="text-[#D4AF37] font-semibold">Outbound</p>

                <p>
                  Distance: {Number(estimate?.outbound?.distanceMiles || 0).toFixed(2)} mi
                </p>

                <p>
                  Base: $
                  {Number(estimate?.outbound?.basePrice || 0).toFixed(2)}
                </p>

                <p>
                  Traffic: {estimate?.outbound?.trafficDelayPercent || 0}%
                </p>

                <p className="text-white font-semibold">
                  Total: $
                  {Number(estimate?.outbound?.TotalPrice || 0).toFixed(2)}
                </p>
              </div>

              {rideInfo.tripType === "roundTrip" && (
                <div className="pt-3 border-t border-[#333]">

                  <p className="text-[#D4AF37] font-semibold">
                    Return
                  </p>

                  <p>
                    Distance: {Number(estimate?.return?.distanceMiles || 0).toFixed(2)} mi
                  </p>

                  <p>
                    Base: $
                    {Number(estimate?.return?.basePrice || 0).toFixed(2)}
                  </p>

                  <p>
                    Traffic: {estimate?.return?.trafficDelayPercent || 0}%
                  </p>

                  <p className="text-white font-semibold">
                    Total: $
                    {Number(estimate?.return?.TotalPrice || 0).toFixed(2)}
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

              {rideInfo.tripType === "roundTrip" && rideInfo.returnTrip && (
                <>
                  <hr className="border-[#2a2a2a] my-3" />

                  <p>
                    <strong>Return Pickup:</strong>{" "}
                    {rideInfo.returnTrip.pickupLocation}
                  </p>

                  <p>
                    <strong>Return Drop-off:</strong>{" "}
                    {rideInfo.returnTrip.dropoffLocation}
                  </p>

                  <p>
                    <strong>Return Date:</strong>{" "}
                    {new Date(
                      rideInfo.returnTrip.pickupDate
                    ).toLocaleString()}
                  </p>

                  <p>
                    <strong>Return Distance:</strong>{" "}
                    {Number(
                      rideInfo.returnTrip.distance || 0
                    ).toFixed(2)} mi
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
                <strong>Outbound Distance:</strong>{" "}
                {Number(rideInfo.distance || 0).toFixed(2)} mi
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
                Guest checkout available below
              </p>
            )}
          </div>

          {/* Confirm Booking Button */}
          {!bookingReady && (
            <button
              onClick={() => handleBookingConfirm()}
              disabled={loading}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#b58a2a] via-[#D4AF37] to-[#8a6a1f] text-black font-bold text-lg shadow-lg hover:scale-[1.02] transition"
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
                onClick={handleStripePayment}
                className="w-full py-4 pb-5 rounded-2xl bg-[#635BFF] text-white font-bold hover:opacity-90 transition"
              >
                Pay with Stripe
              </button>
              <div className="mt-8">
                <PayPalButton
                  amount={displayTotal}
                  bookingId={bookingId}
                  token={user?.token}
                />
              </div>
            </div>
          )}

        </div>



      </div>
    </div>
  );
}

export default FinalDetails;

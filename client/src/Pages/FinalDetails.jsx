import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function FinalDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rideInfo, selectedCar, estimate } = location.state || {};

  const user = useSelector((state) => state.auth.userInfo);
  const [loading, setLoading] = useState(false);



  if (!rideInfo || !selectedCar) {
    return (
      <div className="text-white flex items-center justify-center h-screen bg-black text-center p-4">
        <p>No booking details found. Please start your reservation again.</p>
      </div>
    );
  }

  const estimatedTotal = estimate?.estimatedPrice ?? 0;

  // 🔹 Save booking & redirect to Stripe checkout
  const handleBookingConfirm = async (guestInfo = null) => {
    try {
      setLoading(true);

      // Validate required info
      if (
        !rideInfo.pickupLocation ||
        !rideInfo.dropoffLocation ||
        rideInfo.distance == null
      ) {
        alert("Incomplete ride information. Please go back and check your details.");
        return;
      }

      if (!selectedCar?._id) {
        alert("No car selected. Please go back and select a car.");
        return;
      }

      // Prepare booking payload
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
        totalPrice: Number(estimatedTotal),
        status: "pending",
      };
      console.log(selectedCar);




      // Headers with auth token if logged in
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};

      // 1️⃣ Save booking in DB
      const bookingRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        bookingPayload,
        { headers }
      );

      const booking = bookingRes.data.booking || bookingRes.data;

      console.log("BOOKING CREATED:", {
        id: booking._id,
        distance: booking.distance,
        totalPrice: booking.totalPrice,
        carSnapshot: booking.carSnapshot,
      });


      if (
        !Number.isFinite(Number(booking.distance)) ||
        Number(booking.distance) <= 0 ||
        !Number.isFinite(Number(booking.carSnapshot?.pricePerMile)) ||
        Number(booking.carSnapshot?.pricePerMile) <= 0
      ) {
        console.error("BAD BOOKING DATA", booking);

        alert(
          `Pricing data missing.
Distance: ${booking.distance}
PricePerMile: ${booking.carSnapshot?.pricePerMile}`
        );

        return;
      }

      // const quoteRes = await axios.post(
      //   `${import.meta.env.VITE_API_URL}/api/bookings/finalize-quote`,
      //   {
      //     bookingId: booking._id,
      //   },
      //   { headers }
      // );

      // console.log("QUOTE RESULT:", quoteRes.data);



      // 2️⃣ Create Stripe checkout session
      console.log("SENDING TO STRIPE:", {
        bookingId: booking._id,
        distance: booking.distance,
        totalPrice: booking.totalPrice,
        carSnapshot: booking.carSnapshot,
      });


      const stripeRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments/create-checkout-session`,
        {
          bookingId: booking._id,
          // amount: Number(estimatedTotal),
        },
        { headers }
      );

      // 3️⃣ Redirect to Stripe Checkout
      window.location.href = stripeRes.data.url;
    } catch (err) {
      console.error("Booking or payment error:", err);
      alert(
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        "Unable to complete booking."
      );
    } finally {
      setLoading(false);
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
              <p className="text-gray-400 text-sm">Estimated Total</p>
              <p className="text-4xl font-bold text-[#D4AF37]">
                ${Number(estimatedTotal).toFixed(2)}
              </p>
            </div>

            {estimate && (
              <div className="text-right text-xs text-gray-400 space-y-1">
                <p>{estimate.distanceMiles} mi distance</p>
                <p>Base: ${estimate.basePrice}</p>
                <p>Traffic impact: {estimate.trafficDelayPercent}%</p>
              </div>
            )}
          </div>
        </div>
        {/* LEFT SIDE - HERO CAR */}
        <div className="space-y-6">

          {/* RIDE INFO */}
          <div className="bg-[#141414] p-6 rounded-2xl border border-[#2a2a2a]">
            <h3 className="text-lg font-semibold mb-4 text-[#D4AF37]">
              Trip Summary
            </h3>

            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Pickup:</strong> {rideInfo.pickupLocation}</p>
              <p><strong>Drop-off:</strong> {rideInfo.dropoffLocation}</p>
              <p><strong>Date:</strong> {new Date(rideInfo.pickupDate).toLocaleString()}</p>
              <p><strong>Passengers:</strong> {rideInfo.passengers || 1}</p>
              <p><strong>Luggage:</strong> {rideInfo.luggage || 0}</p>
              <p><strong>Distance:</strong> {rideInfo.distance?.toFixed(2)} mi</p>
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

          {/* CTA */}
          <button
            onClick={() => handleBookingConfirm()}
            disabled={loading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#b58a2a] via-[#D4AF37] to-[#8a6a1f] text-black font-bold text-lg shadow-lg hover:scale-[1.02] transition"
          >
            {loading ? "Processing..." : "Confirm & Pay"}
          </button>

        </div>



      </div>
    </div>
  );
}

export default FinalDetails;

import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function FinalDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { rideInfo: stateRideInfo, selectedCar: stateSelectedCar } = location.state || {};

  const user = useSelector((state) => state.auth.userInfo);
  const [loading, setLoading] = useState(false);

  const rideInfo = stateRideInfo;
  const selectedCar = stateSelectedCar;

  if (!rideInfo || !selectedCar) {
    return (
      <div className="text-white flex items-center justify-center h-screen bg-black text-center p-4">
        <p>No booking details found. Please start your reservation again.</p>
      </div>
    );
  }

  const estimatedTotal = selectedCar.price ?? ((rideInfo.distance || 0) * 5).toFixed(2);

  // 🔹 Save booking & redirect to Stripe checkout
  const handleBookingConfirm = async (guestInfo = null) => {
    try {
      setLoading(true);

      // Validate required info
      if (!rideInfo.pickupLocation || !rideInfo.dropoffLocation || !rideInfo.distance) {
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
          pricePerMile: selectedCar.price || 0,
        },
        pickupLocation: rideInfo.pickupLocation,
        dropoffLocation: rideInfo.dropoffLocation,
        pickupDate: rideInfo.pickupDate ? new Date(rideInfo.pickupDate) : null,
        dropoffDate: rideInfo.dropoffDate ? new Date(rideInfo.dropoffDate) : null,
        passengers: rideInfo.passengers || 1,
        luggage: rideInfo.luggage || 0,
        distance: Number(rideInfo.distance || 0),
        totalPrice: Number(estimatedTotal),
        status: "pending",
      };

      // Headers with auth token if logged in
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};

      // 1️⃣ Save booking in DB
      const bookingRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/bookings`,
        bookingPayload,
        { headers }
      );

      const booking = bookingRes.data;

      // 2️⃣ Create Stripe checkout session
      const stripeRes = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payments/create-checkout-session`,
        {
          bookingId: booking._id,
          amount: Number(estimatedTotal),
        },
        { headers }
      );

      // 3️⃣ Redirect to Stripe Checkout
      window.location.href = stripeRes.data.url;
    } catch (err) {
      console.error("Booking or payment error:", err);
      alert(
        err?.response?.data?.message ||
        "Something went wrong while processing your booking or payment."
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
    <div className="min-h-screen bg-black text-white px-[8%] py-12">
      <h2 className="text-3xl font-semibold mb-6">Final Details</h2>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Ride Summary */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg">
          <h3 className="text-xl font-bold mb-3">Ride Information</h3>
          <p><strong>Pickup:</strong> {rideInfo.pickupLocation}</p>
          <p><strong>Drop-off:</strong> {rideInfo.dropoffLocation}</p>
          <p>
            <strong>Date:</strong>{" "}
            {rideInfo.pickupDate ? new Date(rideInfo.pickupDate).toLocaleString() : "—"}
          </p>
          {rideInfo.dropoffDate && (
            <p><strong>Return Date:</strong> {new Date(rideInfo.dropoffDate).toLocaleString()}</p>
          )}
          <p><strong>Passengers:</strong> {rideInfo.passengers || "—"}</p>
          {rideInfo.luggage && <p><strong>Luggage:</strong> {rideInfo.luggage}</p>}
          <p><strong>Distance:</strong> {rideInfo.distance?.toFixed(2) || 0} mi</p>

          <h3 className="text-xl font-bold mt-6 mb-3">Vehicle</h3>
          <p>{selectedCar.name}</p>
          {selectedCar.description && <p>{selectedCar.description}</p>}
          <p className="mt-2 text-yellow-400 font-semibold">
            Estimated Total: ${estimatedTotal}
          </p>
        </div>

        {/* Passenger Info */}
        <div className="bg-[#1a1a1a] p-6 rounded-2xl shadow-lg">
          {user ? (
            <>
              <h3 className="text-xl font-bold mb-4">Passenger Information</h3>
              <div className="space-y-2 text-gray-300">
                <p>
                  <strong>Name:</strong>{" "}
                  {user.firstName && user.lastName
                    ? `${user.firstName} ${user.lastName}`
                    : user.name || "N/A"}
                </p>
                <p><strong>Email:</strong> {user.email || "N/A"}</p>
                <p><strong>Phone:</strong> {user.phone || "N/A"}</p>
              </div>

              <button
                onClick={() => handleBookingConfirm()}
                disabled={loading}
                className={`bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-full transition duration-300 w-full mt-6 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {loading ? "Processing..." : "Confirm & Pay"}
              </button>
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-4">Continue as Guest</h3>
              <form onSubmit={handleGuestSubmit} className="space-y-4">
                <input
                  name="firstName"
                  type="text"
                  placeholder="First Name"
                  required
                  className="w-full p-3 rounded-md bg-[#222] border border-gray-700 focus:outline-none"
                />
                <input
                  name="lastName"
                  type="text"
                  placeholder="Last Name"
                  required
                  className="w-full p-3 rounded-md bg-[#222] border border-gray-700 focus:outline-none"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  required
                  className="w-full p-3 rounded-md bg-[#222] border border-gray-700 focus:outline-none"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  required
                  className="w-full p-3 rounded-md bg-[#222] border border-gray-700 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={`bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 px-6 rounded-full transition duration-300 w-full ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Processing..." : "Confirm & Pay"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default FinalDetails;

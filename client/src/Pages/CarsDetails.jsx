import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate } from "react-router-dom";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice"; // adjust path
import Spinner from "../Components/Spinner";



function CarsDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [checkoutLoading, setCheckoutLoading] = useState(false);




  // ✅ Redux
  const { userInfo, token } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;

  // ✅ Local States
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickUpLocation, setPickUpLocation] = useState("");
  const [dropOffLocation, setDropOffLocation] = useState("");
  const [pickUpDate, setPickUpDate] = useState(null);
  const [dropOffDate, setDropOffDate] = useState(null);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [distance, setDistance] = useState(null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");

  // ✅ Fetch Car Details
  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`https://selfless-renewal-production-793e.up.railway.app/api/cars/${id}`);
        if (!res.ok) throw new Error("Failed to fetch car");
        const data = await res.json();
        setCar(data);
      } catch (error) {
        console.error("Error fetching car:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  // ✅ Estimate Price
  useEffect(() => {
    const fetchEstimate = async () => {
      if (pickUpLocation && dropOffLocation && car?._id) {
        setLoadingEstimate(true);
        try {
          const res = await fetch(
            `https://selfless-renewal-production-793e.up.railway.app/api/bookings/estimate?pickup=${encodeURIComponent(
              pickUpLocation
            )}&dropoff=${encodeURIComponent(dropOffLocation)}&carId=${car._id}`
          );
          const data = await res.json();
          if (res.ok) {
            setEstimatedPrice(data.totalPrice);
            setDistance(data.distanceMiles);
          } else {
            setEstimatedPrice(null);
            setDistance(null);
          }
        } catch (err) {
          console.error("Estimate error:", err);
          setEstimatedPrice(null);
          setDistance(null);
        } finally {
          setLoadingEstimate(false);
        }
      }
    };
    fetchEstimate();
  }, [pickUpLocation, dropOffLocation, car]);

  // ✅ Booking Handler
  const handleBooking = async () => {
    const token = userInfo?.token || localStorage.getItem("token");

    if (!token) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    if (!pickUpLocation || !dropOffLocation || !pickUpDate || !dropOffDate) {
      alert("Please fill in all booking details before proceeding.");
      return;
    }

    try {
      setCheckoutLoading(true);
      // Step 1 — Create booking
      const bookingRes = await fetch("https://selfless-renewal-production-793e.up.railway.app/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          car: id,
          pickupLocation: pickUpLocation,
          dropoffLocation: dropOffLocation,
          pickupDate: pickUpDate,
          dropoffDate: dropOffDate,
        }),
      });

      const bookingData = await bookingRes.json();

      if (!bookingRes.ok) {
        console.error("Booking creation failed:", bookingData);
        alert(bookingData.message || "Booking failed.");
        return;
      }

      // Step 2 — Create Stripe checkout session
      const stripeRes = await fetch(
        "https://selfless-renewal-production-793e.up.railway.app/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            bookingId: bookingData._id,
            amount: estimatedPrice,
          }),
        }
      );

      const stripeData = await stripeRes.json();

      if (!stripeRes.ok || !stripeData.url) {
        console.error("Stripe session error:", stripeData);
        alert(stripeData.message || "Unable to start payment.");
        return;
      }

      // Step 3 — Redirect user to Stripe Checkout
      window.location.href = stripeData.url;
    } catch (error) {
      console.error("Booking error:", error);
      alert("Something went wrong. Please try again.");
    }
  };


  // ✅ Auth Handler
  const handleAuth = async () => {
    try {
      setAuthError("");
      const endpoint =
        authMode === "login" ? "/api/auth/login" : "/api/auth/register";

      const payload =
        authMode === "login"
          ? { email: authEmail, password: authPassword }
          : { name: authName, email: authEmail, password: authPassword };

      const res = await fetch(`https://selfless-renewal-production-793e.up.railway.app${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.user && data.token) {
          dispatch(setCredentials({ user: data.user, token: data.token }));
        } else if (data.token) {
          const { token, ...user } = data;
          dispatch(setCredentials({ user, token }));
        }

        setShowAuthModal(false);
      } else {
        setAuthError(data.message || "Authentication failed");
      }
    } catch (err) {
      console.error("Auth error:", err);
      setAuthError("Something went wrong. Try again.");
    }
  };

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  if (loading) return <div className="text-white text-center mt-20">Loading...</div>;
  if (!car) return <div className="text-white text-center mt-20">Car Not Found</div>;
  if (!isLoaded) return <div className="text-white text-center mt-20">Loading Maps...</div>;

  return (
    <>
      {/* HERO SECTION */}
      <div className="bg-[#121212] text-white font-sans">
        <div
          className="relative h-[78vh] bg-cover bg-center flex items-end px-[12%] py-20"
          style={{ backgroundImage: `url(${car.image})` }}
        >
          <div className="absolute inset-0 cars-det-section"></div>
          <div className="relative z-10">
            <h6 className="uppercase text-xl tracking-widest text-[#d8c305c5] font-bricolage">
              {car.type} Cars
            </h6>
            <h1 className="text-4xl lg:text-6xl font-bold font-bricolage">{car.name}</h1>
          </div>
        </div>
      </div>

      {/* BOOKING PANEL */}
      <div className="flex flex-col lg:flex-row gap-10 px-[12%] py-14">
        <div className="flex-1 space-y-12 text-white">
          <h2 className="text-2xl font-bold">General Information</h2>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>{car.seats} Seats</li>
            <li>{car.transmission}</li>
            <li>{car.fuel}</li>
            <li>{car.speed}</li>
          </ul>
        </div>

        <div className="w-full lg:w-[320px] space-y-6 bg-[#1a1a1a] rounded-2xl p-6 shadow-md">
          <div className="text-center">
            <p className="text-5xl font-bold text-white font-bricolage">
              ${car.perMileRate}
              <span className="text-sm font-medium text-white block">Per Mile</span>
            </p>
          </div>

          {/* FORM */}
          <div className="flex flex-col gap-4">
            <Autocomplete>
              <input
                type="text"
                placeholder="Pickup Location"
                className="w-full h-[50px] px-3 bg-[#121212] text-white rounded-sm border border-gray-600"
                value={pickUpLocation}
                onChange={(e) => setPickUpLocation(e.target.value)}
                disabled={!isLoggedIn}
              />
            </Autocomplete>

            <Autocomplete>
              <input
                type="text"
                placeholder="Drop-off Location"
                className="w-full h-[50px] px-3 bg-[#121212] text-white !i rounded-sm border border-gray-600"
                value={dropOffLocation}
                onChange={(e) => setDropOffLocation(e.target.value)}
                disabled={!isLoggedIn}
              />
            </Autocomplete>

            <DatePicker
              selected={pickUpDate}
              onChange={(date) => setPickUpDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="MM/dd/yyyy h:mm aa"
              placeholderText="Pick-up Date & Time"
              className="w-full bg-[#121212] text-white rounded-sm px-3 h-[50px]"
              disabled={!isLoggedIn}
            />

            <DatePicker
              selected={dropOffDate}
              onChange={(date) => setDropOffDate(date)}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={30}
              dateFormat="MM/dd/yyyy h:mm aa"
              placeholderText="Drop-off Date & Time"
              className="w-full bg-[#121212] text-white rounded-sm px-3 h-[50px]"
              disabled={!isLoggedIn}
            />

            {/* PRICE */}
            {loadingEstimate ? (
              <p className="text-sm text-gray-400 text-center">Calculating fare...</p>
            ) : estimatedPrice ? (
              <div className="bg-[#2a2a2a] p-3 rounded-lg text-white text-center">
                <p>Distance: {distance?.toFixed(1)} miles</p>
                <p className="font-bold text-lg">
                  Estimated Total: ${estimatedPrice.toFixed(2)}
                </p>
              </div>
            ) : null}

            <button
              onClick={() => {
                if (isLoggedIn) handleBooking();
                else setShowAuthModal(true);
              }}
              className="bg-[#d8c305c5] text-white py-2 rounded-xl hover:bg-[#1f1c01c5] transition font-bricolage"
            >
              {isLoggedIn ? "Rent Now" : "Login / Signup to Book"}
            </button>
          </div>
        </div>
      </div>
      {/* ✅ Checkout Spinner Overlay */}
      {checkoutLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex flex-col items-center justify-center z-[9999]">
          <Spinner />
          <p className="text-white mt-4 text-lg font-medium">
            Redirecting to payment...
          </p>
        </div>
      )}

      {/* ✅ SUCCESS MODAL */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-8 rounded-2xl text-center w-[350px]">
            <h2 className="text-2xl font-bold text-[#d8c305c5] mb-4">
              Booking Confirmed 🎉
            </h2>
            <p className="text-gray-300 mb-6">
              Your booking was successful! Redirecting to your bookings...
            </p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/mybookings");
              }}
              className="bg-[#d8c305c5] text-white py-2 px-6 rounded-xl hover:bg-[#b8a705]"
            >
              Go Now
            </button>
          </div>
        </div>
      )}

      {/* ✅ AUTH MODAL */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-8 rounded-2xl w-[350px]">
            <h2 className="text-2xl font-bold mb-4 text-white text-center">
              {authMode === "login" ? "Login" : "Sign Up"}
            </h2>

            {authMode === "register" && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full mb-3 p-2 rounded bg-[#121212] text-white"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
              />
            )}

            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 rounded bg-[#121212] text-white"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-4 p-2 rounded bg-[#121212] text-white"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
            />

            {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}

            <button
              onClick={handleAuth}
              className="w-full bg-[#d8c305c5] py-2 rounded-xl text-white font-semibold"
            >
              {authMode === "login" ? "Login" : "Sign Up"}
            </button>

            <p className="text-gray-400 text-sm text-center mt-3">
              {authMode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <span
                    onClick={() => setAuthMode("register")}
                    className="text-[#d8c305c5] cursor-pointer"
                  >
                    Sign up
                  </span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span
                    onClick={() => setAuthMode("login")}
                    className="text-[#d8c305c5] cursor-pointer"
                  >
                    Login
                  </span>
                </>
              )}
            </p>

            <button
              onClick={() => setShowAuthModal(false)}
              className="mt-4 w-full py-2 rounded-xl text-gray-400 hover:text-white text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default CarsDetails;

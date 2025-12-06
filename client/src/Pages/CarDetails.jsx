// src/pages/CarDetails.jsx
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useLoadScript, Autocomplete, GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import { useSelector, useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice"; // adjust path
import Spinner from "../Components/Spinner";
import dayjs from "dayjs";

function CarDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // incoming state from previous step
  const incoming = location.state || {};
  const incomingTrip = incoming.tripData || null;
  const incomingDistance = incoming.distance || null;
  const incomingDirections = incoming.directions || null;
  const incomingCar = incoming.car || null;

  // redux
  const { userInfo, token } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;

  // local
  const [car, setCar] = useState(incomingCar || null);
  const [loading, setLoading] = useState(true);
  const [pickUpLocation, setPickUpLocation] = useState(incomingTrip?.pickupLocation || "");
  const [dropOffLocation, setDropOffLocation] = useState(incomingTrip?.dropoffLocation || "");
  const [pickUpDate, setPickUpDate] = useState(incomingTrip?.pickupDate ? new Date(incomingTrip.pickupDate) : null);
  const [dropOffDate, setDropOffDate] = useState(incomingTrip?.dropoffDate ? new Date(incomingTrip.dropoffDate) : null);

  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [distance, setDistance] = useState(incomingDistance || null);
  const [loadingEstimate, setLoadingEstimate] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");

  // Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_KEY,
    libraries: ["places"],
  });
  const [directions, setDirections] = useState(incomingDirections || null);

  // fetch car if not passed in via state
  useEffect(() => {
    const fetchCar = async () => {
      if (car) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`https://lecharlotlimo.onrender.com/api/cars/${id}`);
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
  }, [id, car]);

  // If we haven't a distance but we have pickup+dropoff and maps loaded, get directions & distance
  useEffect(() => {
    const fetchClientDirections = async () => {
      if (!isLoaded) return;
      if ((!distance || !directions) && pickUpLocation && dropOffLocation) {
        try {
          const service = new window.google.maps.DirectionsService();
          service.route(
            {
              origin: pickUpLocation,
              destination: dropOffLocation,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                setDirections(result);
                const leg = result.routes[0].legs[0];
                const miles = leg.distance.value / 1609.344;
                setDistance(Number(miles.toFixed(2)));
              } else {
                console.error("Directions request failed:", status);
              }
            }
          );
        } catch (err) {
          console.error("Directions client error:", err);
        }
      }
    };
    fetchClientDirections();
  }, [isLoaded, pickUpLocation, dropOffLocation, distance, directions]);

  // compute estimate locally when car & distance available
  useEffect(() => {
    if (car && distance != null) {
      setEstimatedPrice(Number((distance * (car.perMileRate ?? 5)).toFixed(2)));
    } else {
      setEstimatedPrice(null);
    }
  }, [car, distance]);

  // Booking Handler (kept from your existing logic)
  const handleBooking = async () => {
    const userToken = userInfo?.token || localStorage.getItem("token");

    if (!userToken) {
      setShowAuthModal(true);
      return;
    }

    if (!pickUpLocation || !dropOffLocation || !pickUpDate || !dropOffDate) {
      alert("Please fill in all booking details before proceeding.");
      return;
    }

    try {
      // create booking on server
      const bookingRes = await fetch("https://lecharlotlimo.onrender.com/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          car: car._id,
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

      // create stripe session
      const stripeRes = await fetch(
        "https://lecharlotlimo.onrender.com/api/payments/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userToken}`,
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

      // redirect to stripe
      window.location.href = stripeData.url;
    } catch (err) {
      console.error("Booking error:", err);
      alert("Something went wrong. Please try again.");
    }
  };

  // Auth Handler (kept from your existing logic, simplified)
  const handleAuth = async () => {
    try {
      setAuthError("");
      const endpoint = authMode === "login" ? "/api/auth/login" : "/api/auth/register";
      const payload =
        authMode === "login"
          ? { email: authEmail, password: authPassword }
          : { name: authName, email: authEmail, password: authPassword };

      const res = await fetch(`https://lecharlotlimo.onrender.com${endpoint}`, {
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

  if (loading) return <div className="text-center mt-20">Loading...</div>;
  if (!car) return <div className="text-center mt-20">Car Not Found</div>;
  if (!isLoaded) return <div className="text-center mt-20">Loading Maps...</div>;

  return (
    <>
      {/* Hero */}
      <div className="bg-[#121212] text-white">
        <div className="relative h-[38vh] bg-cover bg-center flex items-end px-[8%] py-12" style={{ backgroundImage: `url(${car.image})` }}>
          <div className="relative z-10">
            <h6 className="uppercase text-sm tracking-widest text-[#d8c305c5]">{car.type} Cars</h6>
            <h1 className="text-3xl font-bold">{car.name}</h1>
          </div>
        </div>
      </div>

      {/* Booking + Map */}
      <div className="max-w-6xl mx-auto py-10 px-4 grid lg:grid-cols-3 gap-8">
        {/* left: details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-semibold mb-3">Ride Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-700">
              <div>
                <p className="text-xs text-gray-500">Pickup</p>
                <p>{pickUpLocation || car.defaultPickup || "—"}</p>
                <p className="text-xs text-gray-400">{pickUpDate ? dayjs(pickUpDate).format("MM/DD/YYYY hh:mm A") : (incomingTrip?.pickupDate ? dayjs(incomingTrip.pickupDate).format("MM/DD/YYYY hh:mm A") : "")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Drop-off</p>
                <p>{dropOffLocation || "—"}</p>
                <p className="text-xs text-gray-400">{dropOffDate ? dayjs(dropOffDate).format("MM/DD/YYYY hh:mm A") : (incomingTrip?.dropoffDate ? dayjs(incomingTrip.dropoffDate).format("MM/DD/YYYY hh:mm A") : "")}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Distance</p>
                <p>{distance ? `${distance} miles` : "—"}</p>
                <p className="text-xs text-gray-500 mt-2">Rate: ${car.perMileRate ?? 5} / mile</p>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-white rounded-lg overflow-hidden shadow">
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "360px" }}
              center={directions ? undefined : { lat: 39.8283, lng: -98.5795 }}
              zoom={directions ? 10 : 4}
            >
              {directions && <DirectionsRenderer directions={directions} />}
            </GoogleMap>
          </div>
        </div>

        {/* right: booking panel */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 text-white">
          <div className="text-center mb-4">
            <p className="text-4xl font-bold">${car.perMileRate ?? 5}</p>
            <p className="text-sm">Per Mile</p>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-gray-400">Pickup Location</label>
            <input value={pickUpLocation} onChange={(e) => setPickUpLocation(e.target.value)} className="w-full p-2 rounded bg-[#121212] text-white" />

            <label className="text-xs text-gray-400">Drop-off Location</label>
            <input value={dropOffLocation} onChange={(e) => setDropOffLocation(e.target.value)} className="w-full p-2 rounded bg-[#121212] text-white" />

            <label className="text-xs text-gray-400">Pickup Date & Time</label>
            <DatePicker selected={pickUpDate} onChange={(d) => setPickUpDate(d)} showTimeSelect timeIntervals={30} dateFormat="MM/dd/yyyy h:mm aa" className="w-full p-2 rounded bg-[#121212] text-white" />

            <label className="text-xs text-gray-400">Drop-off Date & Time</label>
            <DatePicker selected={dropOffDate} onChange={(d) => setDropOffDate(d)} showTimeSelect timeIntervals={30} dateFormat="MM/dd/yyyy h:mm aa" className="w-full p-2 rounded bg-[#121212] text-white" />

            {loadingEstimate ? <p className="text-sm text-gray-400">Calculating fare...</p> : estimatedPrice ? (
              <div className="bg-[#2a2a2a] p-3 rounded">
                <p>Distance: {distance ? `${distance} miles` : "—"}</p>
                <p className="font-bold text-lg">Estimated Total: ${estimatedPrice}</p>
              </div>
            ) : null}

            <button onClick={() => { if (isLoggedIn) handleBooking(); else setShowAuthModal(true); }} className="w-full mt-3 bg-[#d8c305c5] text-black py-2 rounded font-semibold">
              {isLoggedIn ? "Rent Now" : "Login / Signup to Book"}
            </button>
          </div>
        </div>
      </div>

      {/* Checkout spinner */}
      {/* You can re-add your checkoutLoading spinner overlay here if you kept that state in your original file */}

      {/* Auth modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#1a1a1a] p-8 rounded-2xl w-[350px]">
            <h2 className="text-2xl font-bold mb-4 text-white text-center">{authMode === "login" ? "Login" : "Sign Up"}</h2>

            {authMode === "register" && (
              <input type="text" placeholder="Full Name" className="w-full mb-3 p-2 rounded bg-[#121212] text-white" value={authName} onChange={(e) => setAuthName(e.target.value)} />
            )}

            <input type="email" placeholder="Email" className="w-full mb-3 p-2 rounded bg-[#121212] text-white" value={authEmail} onChange={(e) => setAuthEmail(e.target.value)} />
            <input type="password" placeholder="Password" className="w-full mb-3 p-2 rounded bg-[#121212] text-white" value={authPassword} onChange={(e) => setAuthPassword(e.target.value)} />

            {authError && <p className="text-red-400 text-sm mb-3">{authError}</p>}

            <button onClick={handleAuth} className="w-full bg-[#d8c305c5] py-2 rounded-xl text-black font-semibold">{authMode === "login" ? "Login" : "Sign Up"}</button>

            <p className="text-gray-400 text-sm text-center mt-3">
              {authMode === "login" ? (
                <>
                  Don’t have an account?{" "}
                  <span onClick={() => setAuthMode("register")} className="text-[#d8c305c5] cursor-pointer">Sign up</span>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <span onClick={() => setAuthMode("login")} className="text-[#d8c305c5] cursor-pointer">Login</span>
                </>
              )}
            </p>

            <button onClick={() => setShowAuthModal(false)} className="mt-4 w-full py-2 rounded-xl text-gray-400 hover:text-white text-sm">Cancel</button>
          </div>
        </div>
      )}
    </>
  );
}

export default CarDetails;

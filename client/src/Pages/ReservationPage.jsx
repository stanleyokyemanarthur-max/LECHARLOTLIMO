// src/pages/ReservationPage.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import dayjs from "dayjs";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import "flatpickr/dist/themes/dark.css"; // Flatpickr dark theme
import { useDispatch, useSelector } from "react-redux";
import { setTripData } from "../slices/bookingSlice";

const MAP_CONTAINER_STYLE = { width: "100%", height: "400px" };
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // Center of USA

export default function ReservationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get login state from Redux
  const isLoggedIn = useSelector((state) => !!state.auth?.token);

  const [tripData, setTripDataState] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: null,
    dropoffDate: null,
    passengers: "",
    luggage: "",
    distance: null,
  });

  const [directionsResult, setDirectionsResult] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState("");

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  const minPickupDate = useMemo(() => new Date(Date.now() + 2 * 60 * 60 * 1000), []);

  // Google Autocomplete setup
  useEffect(() => {
    if (!window.google || !window.google.maps || !window.google.maps.places) return;
    const options = { types: ["geocode"], componentRestrictions: { country: "us" } };

    const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupRef.current, options);
    const dropoffAutocomplete = new window.google.maps.places.Autocomplete(dropoffRef.current, options);

    pickupAutocomplete.addListener("place_changed", () => {
      const place = pickupAutocomplete.getPlace();
      if (place?.formatted_address) {
        setTripDataState((s) => ({ ...s, pickupLocation: place.formatted_address }));
      }
    });

    dropoffAutocomplete.addListener("place_changed", () => {
      const place = dropoffAutocomplete.getPlace();
      if (place?.formatted_address) {
        setTripDataState((s) => ({ ...s, dropoffLocation: place.formatted_address }));
      }
    });

    return () => {
      if (pickupAutocomplete && pickupAutocomplete.getPlace) {
        window.google.maps.event.clearInstanceListeners(pickupAutocomplete);
      }
      if (dropoffAutocomplete && dropoffAutocomplete.getPlace) {
        window.google.maps.event.clearInstanceListeners(dropoffAutocomplete);
      }
    };
  }, []);

  const handleInputChange = (e) =>
    setTripDataState((s) => ({ ...s, [e.target.name]: e.target.value }));

  const validateTwoHourRule = () => {
    if (!tripData.pickupDate) return false;
    const pickup = dayjs(tripData.pickupDate);
    return pickup.diff(dayjs(), "minute") >= 120;
  };

  // Auto draw route
  useEffect(() => {
    const autoDrawRoute = async () => {
      if (!tripData.pickupLocation || !tripData.dropoffLocation) return;
      if (!window.google) return;

      setLoadingRoute(true);
      setError("");
      try {
        const directionsService = new window.google.maps.DirectionsService();
        directionsService.route(
          {
            origin: tripData.pickupLocation,
            destination: tripData.dropoffLocation,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === "OK" && result.routes?.length) {
              const leg = result.routes[0].legs[0];
              const miles = leg.distance.value / 1609.344;
              setDirectionsResult(result);
              setTripDataState((s) => ({ ...s, distance: miles }));
            } else {
              setDirectionsResult(null);
              setError("Could not draw route. Please check the locations.");
            }
            setLoadingRoute(false);
          }
        );
      } catch (err) {
        console.error("Route drawing failed:", err);
        setError("Could not draw route. Try again.");
        setLoadingRoute(false);
      }
    };
    autoDrawRoute();
  }, [tripData.pickupLocation, tripData.dropoffLocation]);

  const handlePreviewAndProceed = (e) => {
    e.preventDefault();
    setError("");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (!tripData.pickupLocation || !tripData.dropoffLocation || !tripData.pickupDate) {
      setError("Please fill pickup, drop-off, and pickup date/time.");
      return;
    }

    if (!validateTwoHourRule()) {
      setError("Reservations are disallowed less than 2 hour(s) before trip time.");
      return;
    }

    if (!tripData.distance) {
      setError("Please wait for the route to load before continuing.");
      return;
    }

    const payload = {
      ...tripData,
      pickupDate: tripData.pickupDate ? tripData.pickupDate.toISOString() : null,
      dropoffDate: tripData.dropoffDate ? tripData.dropoffDate.toISOString() : null,
      distance: tripData.distance ? Number(tripData.distance.toFixed(2)) : null,
    };

    dispatch(setTripData(payload));
    navigate("/select-car");
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center mt-10 py-28 px-4 font-[Poppins]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-[#121212] shadow-[0_0_25px_rgba(212,175,55,0.15)] rounded-2xl p-10 grid md:grid-cols-2 gap-10"
      >
        {/* Left: Form */}
        <form onSubmit={handlePreviewAndProceed} className="space-y-6 text-[#EDEDED]">
          <h2 className="text-3xl font-[Playfair_Display] font-semibold text-[#B8860B] tracking-wide mb-4">
            Step 1 — Booking Information
          </h2>

          {[{ label: "Pickup Location", name: "pickupLocation", ref: pickupRef, placeholder: "e.g. Raleigh Convention Center" },
            { label: "Drop-off Location", name: "dropoffLocation", ref: dropoffRef, placeholder: "e.g. Crown Complex, Fayetteville" }].map((f) => (
            <div key={f.name}>
              <label className="text-sm uppercase text-[#C0C0C0] font-semibold tracking-wider">{f.label}</label>
              <input
                ref={f.ref}
                name={f.name}
                value={tripData[f.name]}
                onChange={(e) => setTripDataState((s) => ({ ...s, [f.name]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full mt-2 bg-transparent border border-[#2D2D2D] text-[#F5F5F5] p-3 rounded-lg focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition"
                required
              />
            </div>
          ))}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm uppercase text-[#C0C0C0] font-semibold tracking-wider">Pickup Date & Time</label>
              <Flatpickr
                value={tripData.pickupDate}
                onChange={(dates) => {
                  const dt = dates && dates[0] ? dates[0] : null;
                  setTripDataState((s) => ({ ...s, pickupDate: dt }));
                  if (dt && sHasDropEarlier(dt, tripData.dropoffDate)) {
                    setTripDataState((s) => ({ ...s, dropoffDate: null }));
                  }
                }}
                options={{ enableTime: true, dateFormat: "Y-m-d H:i", minDate: minPickupDate, time_24hr: false }}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-[#2D2D2D] text-white placeholder-gray-500 focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600"
                placeholder="Select pickup date & time"
              />
            </div>

            <div>
              <label className="text-sm uppercase text-[#C0C0C0] font-semibold tracking-wider">Drop-off Date & Time</label>
              <Flatpickr
                value={tripData.dropoffDate}
                onChange={(dates) => {
                  const dt = dates && dates[0] ? dates[0] : null;
                  setTripDataState((s) => ({ ...s, dropoffDate: dt }));
                }}
                options={{ enableTime: true, dateFormat: "Y-m-d H:i", minDate: tripData.pickupDate ? tripData.pickupDate : minPickupDate, time_24hr: false }}
                className="w-full mt-2 px-4 py-3 rounded-xl bg-black/40 border border-[#2D2D2D] text-white placeholder-gray-500 focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]"
                placeholder="Select drop-off date & time"
              />
            </div>
          </div>

          {/* Passengers / Luggage */}
          <div className="grid grid-cols-2 gap-4">
            {[{ label: "Passengers", name: "passengers", placeholder: "3" },
              { label: "Luggage", name: "luggage", placeholder: "2" }].map((f) => (
              <div key={f.name}>
                <label className="text-sm uppercase text-[#C0C0C0] font-semibold tracking-wider">{f.label}</label>
                <input
                  type="number"
                  name={f.name}
                  min={f.name === "passengers" ? 1 : 0}
                  value={tripData[f.name]}
                  onChange={handleInputChange}
                  placeholder={f.placeholder}
                  className="w-full mt-2 bg-transparent border border-[#2D2D2D] text-[#F5F5F5] p-3 rounded-lg focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B]"
                />
              </div>
            ))}
          </div>

          {error && <p className="text-[#FF6B6B] text-sm">{error}</p>}

          {/* Conditional Button */}
          <button
            type="submit"
            disabled={loadingRoute || !isLoggedIn}
            onClick={() => !isLoggedIn && navigate("/login")}
            className="w-full bg-gradient-to-r from-[#B8860B] to-[#B8860B] text-black py-3 rounded-lg font-semibold hover:brightness-110 transition disabled:opacity-60 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
          >
            {isLoggedIn ? (loadingRoute ? "Drawing route..." : "Book Now") : "Login to Book"}
          </button>
        </form>

        {/* Google Map */}
        <div className="rounded-xl overflow-hidden border border-[#2A2A2A]">
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={directionsResult ? undefined : DEFAULT_CENTER}
            zoom={directionsResult ? undefined : 4}
            onLoad={(map) => {
              if (directionsResult && directionsResult.routes && directionsResult.routes[0]) {
                const bounds = directionsResult.routes[0].bounds;
                map.fitBounds(bounds);
              }
            }}
          >
            {directionsResult && (
              <DirectionsRenderer
                directions={directionsResult}
                options={{ suppressMarkers: false, polylineOptions: { strokeColor: "#D4AF37", strokeWeight: 5 } }}
              />
            )}
          </GoogleMap>
        </div>
      </motion.div>
    </div>
  );
}

// Helper: check if dropoff is earlier than pickup
function sHasDropEarlier(pickupDate, dropoffDate) {
  if (!pickupDate || !dropoffDate) return false;
  try {
    return dayjs(dropoffDate).isBefore(dayjs(pickupDate));
  } catch {
    return false;
  }
}

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { GoogleMap, DirectionsRenderer } from "@react-google-maps/api";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { setTripData } from "../slices/bookingSlice";

const MAP_CONTAINER_STYLE = { width: "100%", height: "400px" };
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // Center of USA

export default function ReservationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [tripData, setTripDataState] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: "",
    dropoffDate: "",
    passengers: "",
    luggage: "",
  });

  const [directionsResult, setDirectionsResult] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState("");

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  // ✅ Initialize Google Autocomplete
  useEffect(() => {
    if (!window.google || !window.google.maps) return;
    const options = { types: ["geocode"], componentRestrictions: { country: "us" } };

    const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupRef.current, options);
    const dropoffAutocomplete = new window.google.maps.places.Autocomplete(dropoffRef.current, options);

    pickupAutocomplete.addListener("place_changed", () => {
      const place = pickupAutocomplete.getPlace();
      if (place?.formatted_address)
        setTripDataState((s) => ({ ...s, pickupLocation: place.formatted_address }));
    });

    dropoffAutocomplete.addListener("place_changed", () => {
      const place = dropoffAutocomplete.getPlace();
      if (place?.formatted_address)
        setTripDataState((s) => ({ ...s, dropoffLocation: place.formatted_address }));
    });
  }, []);

  const handleChange = (e) => setTripDataState((s) => ({ ...s, [e.target.name]: e.target.value }));

  // ✅ Enforce 2-hour minimum rule
  const validateTwoHourRule = () => {
    if (!tripData.pickupDate) return false;
    const pickup = dayjs(tripData.pickupDate);
    return pickup.diff(dayjs(), "minute") >= 120;
  };

  // ✅ Auto draw Google route
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
            if (status === "OK") {
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

  // ✅ Proceed to car selection
  const handlePreviewAndProceed = (e) => {
    e.preventDefault();
    setError("");

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

    dispatch(setTripData({ ...tripData, distance: Number(tripData.distance.toFixed(2)) }));
    navigate("/select-car");
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center py-16 px-4 font-[Poppins]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-[#121212] shadow-[0_0_25px_rgba(212,175,55,0.15)] rounded-2xl p-10 grid md:grid-cols-2 gap-10"
      >
        {/* Left: Form Section */}
        <form onSubmit={handlePreviewAndProceed} className="space-y-6 text-[#EDEDED]">
          <h2 className="text-3xl font-[Playfair_Display] font-semibold text-[#D4AF37] tracking-wide mb-4">
            Step 1 — Ride Information
          </h2>

          {/* Pickup / Dropoff Inputs */}
          {[
            { label: "Pickup Location", name: "pickupLocation", ref: pickupRef, placeholder: "e.g. Raleigh Convention Center" },
            { label: "Drop-off Location", name: "dropoffLocation", ref: dropoffRef, placeholder: "e.g. Crown Complex, Fayetteville" },
          ].map((f) => (
            <div key={f.name}>
              <label className="text-sm uppercase text-[#C0C0C0] font-semibold tracking-wider">{f.label}</label>
              <input
                ref={f.ref}
                name={f.name}
                value={tripData[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full mt-2 bg-transparent border border-[#2D2D2D] text-[#F5F5F5] p-3 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition"
                required
              />
            </div>
          ))}

          {/* Date / Time Inputs */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Pickup Date & Time", name: "pickupDate", type: "datetime-local" },
              { label: "Drop-off Date & Time", name: "dropoffDate", type: "datetime-local" },
            ].map((f) => (
              <div key={f.name}>
                <label className="text-sm uppercase text-[#C0C0C0] font-semibold tracking-wider">{f.label}</label>
                <input
                  type={f.type}
                  name={f.name}
                  value={tripData[f.name]}
                  onChange={handleChange}
                  className="w-full mt-2 bg-transparent border border-[#2D2D2D] text-[#F5F5F5] p-3 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                  required={f.name === "pickupDate"}
                />
              </div>
            ))}
          </div>

          {/* Passengers / Luggage */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Passengers", name: "passengers", placeholder: "3" },
              { label: "Luggage", name: "luggage", placeholder: "2" },
            ].map((f) => (
              <div key={f.name}>
                <label className="text-sm uppercase text-[#C0C0C0] font-semibold tracking-wider">{f.label}</label>
                <input
                  type="number"
                  name={f.name}
                  min={f.name === "passengers" ? 1 : 0}
                  value={tripData[f.name]}
                  onChange={handleChange}
                  placeholder={f.placeholder}
                  className="w-full mt-2 bg-transparent border border-[#2D2D2D] text-[#F5F5F5] p-3 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
                />
              </div>
            ))}
          </div>

          {/* Error */}
          {error && <p className="text-[#FF6B6B] text-sm">{error}</p>}

          {/* Button */}
          <button
            type="submit"
            disabled={loadingRoute}
            className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C5A02E] text-black py-3 rounded-lg font-semibold hover:brightness-110 transition disabled:opacity-60 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
          >
            {loadingRoute ? "Drawing route..." : "Select a Vehicle"}
          </button>
        </form>

        {/* Right: Google Map */}
        <div className="rounded-xl overflow-hidden border border-[#2A2A2A]">
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={directionsResult ? null : DEFAULT_CENTER}
            zoom={directionsResult ? undefined : 4}
            onLoad={(map) => {
              if (directionsResult) {
                const bounds = directionsResult.routes[0].bounds;
                map.fitBounds(bounds);
              }
            }}
          >
            {directionsResult && (
              <DirectionsRenderer
                directions={directionsResult}
                options={{
                  suppressMarkers: false,
                  polylineOptions: { strokeColor: "#D4AF37", strokeWeight: 5 },
                }}
                onLoad={(renderer) => {
                  const map = renderer.getMap();
                  const bounds = directionsResult.routes[0].bounds;
                  map.fitBounds(bounds);
                }}
              />
            )}
          </GoogleMap>
        </div>
      </motion.div>
    </div>
  );
}

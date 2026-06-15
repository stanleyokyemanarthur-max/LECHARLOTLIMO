// src/pages/ReservationPage.jsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";// Flatpickr dark theme
import { useDispatch, useSelector } from "react-redux";
import { setTripData } from "../slices/bookingSlice";
import { GoogleMap, DirectionsRenderer, useJsApiLoader } from "@react-google-maps/api";

const MAP_CONTAINER_STYLE = { width: "100%", height: "400px" };
const DEFAULT_CENTER = { lat: 39.8283, lng: -98.5795 }; // Center of USA

export default function ReservationPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Get login state from Redux
  const isLoggedIn = useSelector((state) => !!state.auth?.token);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const [tripData, setTripDataState] = useState({
    pickupLocation: "",
    dropoffLocation: "",
    pickupDate: null,
    passengers: "",
    luggage: "",

    distance: null,

    durationMinutes: null,
    durationText: "",

    trafficMinutes: null,
    trafficDurationText: "",

    trafficDelayPercent: 0,
  });

  const [directionsResult, setDirectionsResult] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState("");

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);

  const computedDropoff = useMemo(() => {
    if (!tripData.pickupDate) return null;

    const tripMinutes =
      tripData.trafficMinutes ||
      tripData.durationMinutes;

    if (!tripMinutes) return null;

    const BUFFER_MINUTES = 15;

    return new Date(
      new Date(tripData.pickupDate).getTime() +
      (tripMinutes + BUFFER_MINUTES) * 60000
    );
  }, [
    tripData.pickupDate,
    tripData.trafficMinutes,
    tripData.durationMinutes,
  ]);

  // const minPickupDate = useMemo(() => new Date(Date.now() + 2 * 60 * 60 * 1000), []);

  const luxuryTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#D4AF37",
      },
      background: {
        default: "#0B0B0B",
        paper: "#121212",
      },
    },
  });

  // Google Autocomplete setup
  useEffect(() => {
    if (!isLoaded) return;
    const options = { types: ["geocode"], componentRestrictions: { country: "us" } };

    const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupRef.current, options);
    const dropoffAutocomplete =
      new window.google.maps.places.Autocomplete(
        dropoffRef.current,
        options
      );

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
  }, [isLoaded]);

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
      if (!isLoaded) return;

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

              const distanceMiles =
                leg.distance.value / 1609.344;

              const durationMinutes =
                Math.round(leg.duration.value / 60);

              const durationText =
                leg.duration.text;

              setDirectionsResult(result);

              setTripDataState((prev) => {
                return {
                  ...prev,

                  distance: distanceMiles,

                  durationMinutes,
                  durationText,

                  trafficMinutes: durationMinutes,
                  trafficDurationText: durationText,

                  trafficDelayPercent: 0,
                };
              });
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
      dropoffDate: computedDropoff ? computedDropoff.toISOString() : null,
      distance: tripData.distance ? Number(tripData.distance.toFixed(2)) : null,
    };
console.log("PAYLOAD BEFORE DISPATCH", payload);
    dispatch(setTripData(payload));
    navigate("/select-car");
  };
  if (loadError) {
    return <div style={{ color: "red", padding: "20px" }}>Map failed to load</div>;
  }

  if (!isLoaded) {
    return <div style={{ color: "white", padding: "20px" }}>Loading map...</div>;
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center mt-18 py-28 px-4 font-[Poppins]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-[#121212] shadow-[0_0_25px_rgba(212,175,55,0.15)] rounded-2xl p-10 grid md:grid-cols-2 gap-10"
      >
        {/* Left: Form */}
        {/* form */}
        <ThemeProvider theme={luxuryTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handlePreviewAndProceed} className="space-y-6 text-[#EDEDED]">
              <h2 className="text-3xl  font-[Playfair_Display] font-semibold text-[#D4AF37] tracking-wide mb-4">
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
                    className="w-full mt-2 bg-transparent border border-[#2D2D2D] text-[#F5F5F5] p-3 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition"
                    required
                  />
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {/* <label className="text-sm uppercase text-[#C0C0C0] font-semibold tracking-wider">Pickup Date & Time</label> */}
                  <DateTimePicker
                    label="Pickup Date & Time"
                    value={tripData.pickupDate ? dayjs(tripData.pickupDate) : null}
                    minDateTime={dayjs().add(2, "hour")}
                    onChange={(newValue) => {
                      setTripDataState((s) => ({
                        ...s,
                        pickupDate: newValue ? newValue.toDate() : null,
                      }));
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            color: "#fff",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            borderRadius: "12px",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#C0C0C0",
                          },
                        },
                      },
                    }}
                  />
                </div>
                {computedDropoff && (
                  <div className="mt-3 p-3 rounded-lg border border-[#D4AF37] bg-black/20">
                    <p className="text-[#D4AF37] text-sm font-semibold">
                      Estimated Arrival Time
                    </p>

                    <p className="text-white">
                      {dayjs(computedDropoff).format("MMMM D, YYYY h:mm A")}
                    </p>

                    <p className="text-gray-400 text-sm mt-1">
                      Duration: {tripData.durationText}
                    </p>
                  </div>
                )}

                {/* <div>
              
                  <DateTimePicker
                    label="Drop-off Date & Time"
                    value={tripData.dropoffDate ? dayjs(tripData.dropoffDate) : null}
                    minDateTime={
                      tripData.pickupDate
                        ? dayjs(tripData.pickupDate)
                        : dayjs().add(2, "hour")
                    }
                    onChange={(newValue) => {
                      setTripDataState((s) => ({
                        ...s,
                        dropoffDate: newValue ? newValue.toDate() : null,
                      }));
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          "& .MuiOutlinedInput-root": {
                            color: "#fff",
                            backgroundColor: "rgba(0,0,0,0.4)",
                            borderRadius: "12px",
                          },
                          "& .MuiInputLabel-root": {
                            color: "#C0C0C0",
                          },
                        },
                      },
                    }}
                  />
                </div> */}
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
                      className="w-full mt-2 bg-transparent border border-[#2D2D2D] text-[#F5F5F5] p-3 rounded-lg focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37]"
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
                className="w-full btn btn-gold btn--hero text-black py-3 rounded-lg font-semibold hover:brightness-110 transition disabled:opacity-60 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
              >
                {isLoggedIn ? (loadingRoute ? "Drawing route..." : "Submit Booking") : "Login to Book"}
              </button>
            </form>
          </LocalizationProvider>
        </ThemeProvider>

        {/* Google Map */}
        <div className="rounded-xl overflow-hidden border border-[#2A2A2A]">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={directionsResult ? undefined : DEFAULT_CENTER}
              zoom={directionsResult ? undefined : 4}
              onLoad={(map) => {
                if (directionsResult?.routes?.[0]) {
                  map.fitBounds(directionsResult.routes[0].bounds);
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
                />
              )}
            </GoogleMap>
          )}
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

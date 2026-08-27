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

const MAP_CONTAINER_STYLE = {
  width: "100%",
  height: "100%"
};
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
    tripType: "oneWay",
    pickupLocation: "",
    dropoffLocation: "",
    pickupIsAirport: false,
    dropoffIsAirport: false,
    flightNumber: "",

    pickupDate: null,
    returnDate: null,
    returnFlightNumber: "",
    passengers: "",
    luggage: "",

    distance: null,

    durationMinutes: null,
    durationText: "",

    trafficMinutes: null,
    trafficDurationText: "",
    returnDistance: null,
    returnDurationMinutes: null,
    returnDurationText: "",

    trafficDelayPercent: 0,
  });

  const [outboundDirections, setOutboundDirections] = useState(null);
  const [returnDirections, setReturnDirections] = useState(null);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState("");

  const mapRef = useRef(null);

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const returnPickupLocation = tripData.dropoffLocation;
  const returnDropoffLocation = tripData.pickupLocation;

  const returnPickupIsAirport = tripData.dropoffIsAirport;
  const returnDropoffIsAirport = tripData.pickupIsAirport;


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
    const options = {
      componentRestrictions: {
        country: "us",
      },
    };

    const pickupAutocomplete = new window.google.maps.places.Autocomplete(pickupRef.current, options);
    pickupAutocomplete.setFields([
      "name",
      "formatted_address",
      "geometry",
      "place_id",
      "types"
    ]);

    const dropoffAutocomplete =
      new window.google.maps.places.Autocomplete(
        dropoffRef.current,
        options
      );
    dropoffAutocomplete.setFields([
      "name",
      "formatted_address",
      "geometry",
      "place_id",
      "types"
    ]);

    const pickupListener = pickupAutocomplete.addListener("place_changed", () => {
      const place = pickupAutocomplete.getPlace();

      console.log(place);

      if (!place?.formatted_address) return;

      const isAirport =
        place.types?.includes("airport") ||
        place.name?.toLowerCase().includes("airport") ||
        place.formatted_address?.toLowerCase().includes("airport");

      setTripDataState((s) => ({
        ...s,

        pickupLocation: place.name
          ? `${place.name}, ${place.formatted_address}`
          : place.formatted_address,

        pickupIsAirport: isAirport,

        flightNumber: isAirport ? s.flightNumber : "",
      }));



    });


    const dropoffListener = dropoffAutocomplete.addListener("place_changed", () => {
      const place = dropoffAutocomplete.getPlace();

      console.log("Dropoff place changed:", place);

      if (!place?.formatted_address) return;

      const isAirport =
        place.types?.includes("airport") ||
        place.name?.toLowerCase().includes("airport") ||
        place.formatted_address?.toLowerCase().includes("airport");

      setTripDataState((s) => ({
        ...s,

        dropoffLocation: place.name
          ? `${place.name}, ${place.formatted_address}`
          : place.formatted_address,

        dropoffIsAirport: isAirport,
        flightNumber:
          (s.pickupIsAirport || isAirport)
            ? s.flightNumber
            : "",
      }));
    });


    return () => {
      pickupListener.remove();
      dropoffListener.remove();

      window.google.maps.event.clearInstanceListeners(pickupAutocomplete);
      window.google.maps.event.clearInstanceListeners(dropoffAutocomplete);
    };
  }, [isLoaded]);

  const handleInputChange = (e) =>
    setTripDataState((s) => ({
      ...s,
      [e.target.name]: e.target.value,

      ...(e.target.name === "tripType" &&
        e.target.value === "oneWay"
        ? {
          returnDate: null,
          returnFlightNumber: "",
          returnDistance: null,
          returnDurationMinutes: null,
          returnDurationText: "",
        }
        : {})
    }));

  const validateOneHourRule = () => {
    if (!tripData.pickupDate) return false;
    const pickup = dayjs(tripData.pickupDate);
    return pickup.diff(dayjs(), "minute") >= 60;
  };

  const totalDistance =
    tripData.tripType === "roundTrip"
      ? (tripData.distance || 0) + (tripData.returnDistance || 0)
      : tripData.distance || 0;

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

              setOutboundDirections(result);

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
              setOutboundDirections(null);
              setReturnDirections(null);
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

  useEffect(() => {
    if (!mapRef.current || !outboundDirections) return;

    // Wait for the return route if it's a round trip
    if (tripData.tripType === "roundTrip" && !returnDirections) return;

    const bounds = new window.google.maps.LatLngBounds();

    outboundDirections.routes[0].overview_path.forEach((point) => {
      bounds.extend(point);
    });

    if (returnDirections) {
      returnDirections.routes[0].overview_path.forEach((point) => {
        bounds.extend(point);
      });
    }

    mapRef.current.fitBounds(bounds);
  }, [
    outboundDirections,
    returnDirections,
    tripData.tripType,
  ]);

  useEffect(() => {
    if (
      !isLoaded ||
      tripData.tripType !== "roundTrip" ||
      !tripData.pickupLocation ||
      !tripData.dropoffLocation
    ) {
      setReturnDirections(null);

      setTripDataState(prev => ({
        ...prev,
        returnDistance: null,
        returnDurationMinutes: null,
        returnDurationText: "",
      }));

      return;
    }

    const directionsService =
      new window.google.maps.DirectionsService();

    directionsService.route(
      {
        origin: tripData.dropoffLocation,
        destination: tripData.pickupLocation,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },

      (result, status) => {

        if (status === "OK" && result.routes?.length) {

          const leg = result.routes[0].legs[0];

          const returnDistance =
            leg.distance.value / 1609.344;

          const returnDurationMinutes =
            Math.round(leg.duration.value / 60);


          setReturnDirections(result);


          setTripDataState(prev => ({
            ...prev,

            returnDistance,

            returnDurationMinutes,

            returnDurationText:
              leg.duration.text,
          }));

        } else {

          setReturnDirections(null);

        }
      }
    );

  }, [
    isLoaded,
    tripData.tripType,
    tripData.pickupLocation,
    tripData.dropoffLocation,
  ]);


  const handlePreviewAndProceed = (e) => {
    e.preventDefault();
    setError("");

    if (!isLoggedIn) {
      navigate("/login");
      return;
    }

    if (
      !tripData.pickupLocation ||
      !tripData.dropoffLocation ||
      !tripData.pickupDate ||
      (tripData.tripType === "roundTrip" && !tripData.returnDate)
    ) {
      setError("Please fill pickup, drop-off, and pickup date/time.");
      return;
    }

    if (!validateOneHourRule()) {
      setError("Reservations are disallowed less than 1 hour(s) before trip time.");
      return;
    }

    if (
      tripData.tripType === "roundTrip" &&
      isReturnBeforePickup(tripData.pickupDate, tripData.returnDate)
    ) {
      setError("Return date cannot be before pickup date.");
      return;
    }

    if (!tripData.distance) {
      setError("Please wait for the route to load before continuing.");
      return;
    }

    if (
      tripData.tripType === "roundTrip" &&
      !tripData.returnDistance
    ) {
      setError("Please wait for the return route to load before continuing.");
      return;
    }

    const payload = {
      ...tripData,

      ...(tripData.tripType === "roundTrip" && {
        returnPickupLocation: tripData.dropoffLocation,
        returnDropoffLocation: tripData.pickupLocation,

        returnPickupIsAirport: tripData.dropoffIsAirport,
        returnDropoffIsAirport: tripData.pickupIsAirport,
      }),

      pickupDate: tripData.pickupDate
        ? tripData.pickupDate.toISOString()
        : null,

      returnDate: tripData.returnDate
        ? tripData.returnDate.toISOString()
        : null,

      dropoffDate: computedDropoff
        ? computedDropoff.toISOString()
        : null,

      distance: Number(tripData.distance.toFixed(2)),

      totalDistance: Number(totalDistance.toFixed(2)),

      returnDistance:
        tripData.returnDistance
          ? Number(tripData.returnDistance.toFixed(2))
          : null,

      returnDurationMinutes:
        tripData.returnDurationMinutes || null,

      returnDurationText:
        tripData.returnDurationText || "",
    };

    console.log("PAYLOAD BEFORE DISPATCH", payload);
    console.log("Flight Number:", payload.flightNumber);
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
    <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center mt-18 py-16 md:py-28 px-4 sm:px-6 font-[Poppins]">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-[#121212] shadow-[0_0_25px_rgba(212,175,55,0.15)] rounded-2xl p-10 grid md:grid-cols-2 gap-10 items-stretch"
      >
        {/* Left: Form */}
        {/* form */}
        <ThemeProvider theme={luxuryTheme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <form onSubmit={handlePreviewAndProceed} className="space-y-6 text-[#EDEDED]">
              <h2 className="text-3xl  font-[Playfair_Display] font-semibold text-[#D4AF37] tracking-wide mb-4">
                Step 1 — Booking Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* One Way */}
                <label
                  className={`
      relative cursor-pointer rounded-xl border p-5 transition-all duration-300
      ${tripData.tripType === "oneWay"
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                      : "border-[#2D2D2D] bg-[#181818] hover:border-[#D4AF37]/50"
                    }
    `}
                >
                  <input
                    type="radio"
                    name="tripType"
                    value="oneWay"
                    checked={tripData.tripType === "oneWay"}
                    onChange={handleInputChange}
                    className="hidden"
                  />

                  <div className="flex items-center gap-4">

                    <div
                      className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          ${tripData.tripType === "oneWay"
                          ? "border-[#D4AF37]"
                          : "border-gray-500"
                        }
        `}
                    >
                      {tripData.tripType === "oneWay" && (
                        <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        One Way
                      </h3>
                      <p className="text-sm text-gray-400">
                        Single destination transfer
                      </p>
                    </div>

                  </div>
                </label>


                {/* Round Trip */}
                <label
                  className={`
      relative cursor-pointer rounded-xl border p-5 transition-all duration-300
      ${tripData.tripType === "roundTrip"
                      ? "border-[#D4AF37] bg-[#D4AF37]/10 shadow-[0_0_20px_rgba(212,175,55,0.25)]"
                      : "border-[#2D2D2D] bg-[#181818] hover:border-[#D4AF37]/50"
                    }
    `}
                >
                  <input
                    type="radio"
                    name="tripType"
                    value="roundTrip"
                    checked={tripData.tripType === "roundTrip"}
                    onChange={handleInputChange}
                    className="hidden"
                  />

                  <div className="flex items-center gap-4">

                    <div
                      className={`
          w-6 h-6 rounded-full border-2 flex items-center justify-center
          ${tripData.tripType === "roundTrip"
                          ? "border-[#D4AF37]"
                          : "border-gray-500"
                        }
        `}
                    >
                      {tripData.tripType === "roundTrip" && (
                        <div className="w-3 h-3 rounded-full bg-[#D4AF37]" />
                      )}
                    </div>

                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        Round Trip
                      </h3>
                      <p className="text-sm text-gray-400">
                        Return journey included
                      </p>
                    </div>

                  </div>
                </label>

              </div>
              {/* Hourly Booking Notice */}
              <div className="rounded-xl border border-[#D4AF37]/40 bg-[#D4AF37]/5 p-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-[#D4AF37]">
                    <Clock3 size={20} />
                  </div>

                  <div>
                    <h3 className="text-white font-semibold">
                      Need an hourly booking?
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                      Hourly bookings are available by phone.
                    </p>

                    <a
                      href="tel:4044053738"
                      className="inline-flex items-center mt-2 text-[#D4AF37] font-semibold hover:underline"
                    >
                      Call (404) 405-3738
                    </a>
                  </div>
                </div>
              </div>


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
              {tripData.pickupIsAirport && (
                <div>
                  <label className="text-sm uppercase text-[#C0C0C0] font-semibold tracking-wider">
                    Arrival Flight Number (Optional)
                  </label>

                  <p className="text-xs text-gray-400 mt-1">
                    Helps our driver monitor your arriving flight.
                  </p>

                  <input
                    name="flightNumber"
                    value={tripData.flightNumber || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. BA215"
                    className="w-full mt-2 bg-transparent border border-[#2D2D2D] text-[#F5F5F5] p-3 rounded-lg focus:border-[#D4AF37]"
                  />
                </div>

              )}
              {tripData.dropoffIsAirport && (
                <div>
                  <label className="text-sm uppercase text-[#C0C0C0] font-semibold tracking-wider">
                    Departure Flight Number (Optional)
                  </label>
                  <p className="text-xs text-gray-400 mt-1">
                    Helps our driver track your departing flight time.
                  </p>

                  <input
                    name="flightNumber"
                    value={tripData.flightNumber || ""}
                    onChange={handleInputChange}
                    placeholder="e.g. AA432"
                    className="w-full mt-2 bg-transparent border border-[#2D2D2D] p-3 rounded-lg"
                  />
                </div>
              )}

              {/* 
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <DateTimePicker
                    label="Pickup Date & Time"
                    value={tripData.pickupDate ? dayjs(tripData.pickupDate) : null}
                    minDateTime={dayjs().add(1, "hour")}
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

                  {tripData.tripType === "roundTrip" && (
                    <DateTimePicker
                      label="Return Date & Time"
                      value={
                        tripData.returnDate
                          ? dayjs(tripData.returnDate)
                          : null
                      }
                      minDateTime={
                        tripData.pickupDate
                          ? dayjs(tripData.pickupDate)
                          : dayjs().add(1, "hour")
                      }
                      onChange={(newValue) => {
                        setTripDataState((s) => ({
                          ...s,
                          returnDate: newValue ? newValue.toDate() : null,
                        }));
                      }}
                    />
                  )}
                </div>

              </div> */}
              {/* PICKUP DATE */}
              <div>
                <DateTimePicker
                  label="Pickup Date & Time"
                  value={
                    tripData.pickupDate
                      ? dayjs(tripData.pickupDate)
                      : null
                  }
                  minDateTime={dayjs().add(1, "hour")}
                  onChange={(newValue) => {
                    setTripDataState((s) => ({
                      ...s,
                      pickupDate: newValue
                        ? newValue.toDate()
                        : null,
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


              {/* ESTIMATED ARRIVAL */}
              {computedDropoff && (
                <div className="mt-4 p-3 rounded-lg border border-[#D4AF37] bg-black/20">
                  <p className="text-[#D4AF37] text-sm font-semibold">
                    Estimated Arrival Time
                  </p>

                  <p className="text-white">
                    {dayjs(computedDropoff).format(
                      "MMMM D, YYYY h:mm A"
                    )}
                  </p>

                  <p className="text-gray-400 text-sm mt-1">
                    Duration: {tripData.durationText}
                  </p>
                </div>
              )}


              {/* RETURN DATE ONLY FOR ROUND TRIP */}
              {tripData.tripType === "roundTrip" && (
                <div className="mt-6">

                  <DateTimePicker
                    label="Return Date & Time"
                    value={
                      tripData.returnDate
                        ? dayjs(tripData.returnDate)
                        : null
                    }
                    minDateTime={
                      tripData.pickupDate
                        ? dayjs(tripData.pickupDate)
                        : dayjs().add(1, "hour")
                    }
                    onChange={(newValue) => {
                      setTripDataState((s) => ({
                        ...s,
                        returnDate: newValue
                          ? newValue.toDate()
                          : null,
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
              )}


              {/* RETURN JOURNEY */}
              {tripData.tripType === "roundTrip" && (
                <div className="mt-8 border-t border-[#2D2D2D] pt-6">

                  <h3 className="text-xl text-[#D4AF37] font-semibold mb-5">
                    Return Journey
                  </h3>

                  <div className="space-y-4">

                    <div>
                      <label>Pickup</label>
                      <div className="mt-1 p-3 rounded-lg border border-[#2D2D2D] bg-[#181818]">
                        {returnPickupLocation}
                      </div>
                    </div>


                    <div>
                      <label>Drop-off</label>
                      <div className="mt-1 p-3 rounded-lg border border-[#2D2D2D] bg-[#181818]">
                        {returnDropoffLocation}
                      </div>
                    </div>


                    {returnPickupIsAirport && (
                      <div>
                        <label>
                          Arrival Flight Number (Optional)
                        </label>

                        <p className="text-xs text-gray-400 mt-1">
                          Helps our driver track your arriving flight time.
                        </p >

                        <input
                          name="returnFlightNumber"
                          value={tripData.returnFlightNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. AA432"
                          className="w-full mt-2 bg-transparent border border-[#2D2D2D] p-3 rounded-lg"
                        />
                      </div>
                    )}
                    {returnDropoffIsAirport && (
                      <div>
                        <label>
                          Departure Flight Number (Optional)
                        </label>

                        <p className="text-xs text-gray-400 mt-1">
                          Helps our driver track your departing flight time.
                        </p>

                        <input
                          name="returnFlightNumber"
                          value={tripData.returnFlightNumber}
                          onChange={handleInputChange}
                          placeholder="e.g. AA432"
                          className="w-full mt-2 bg-transparent border border-[#2D2D2D] p-3 rounded-lg"
                        />
                      </div>
                    )}

                  </div>
                </div>
              )}

              {/* Passengers / Luggage */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        <div className="rounded-xl overflow-hidden border border-[#2A2A2A] h-full min-h-[400px]">
          {isLoaded && (
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={outboundDirections ? undefined : DEFAULT_CENTER}
              zoom={outboundDirections ? undefined : 4}
              onLoad={(map) => {
                mapRef.current = map;
              }}
            >
              {outboundDirections && (
                <DirectionsRenderer
                  directions={outboundDirections}
                  options={{
                    suppressMarkers: false,
                    polylineOptions: {
                      strokeColor: "#D4AF37",
                      strokeWeight: 5,
                    },
                  }}
                />
              )}

              {returnDirections && (
                <DirectionsRenderer
                  directions={returnDirections}
                  options={{
                    suppressMarkers: true,
                    polylineOptions: {
                      strokeColor: "#4DA3FF",
                      strokeWeight: 5,
                      strokeOpacity: 0.8,
                    },
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
function isReturnBeforePickup(pickupDate, dropoffDate) {
  if (!pickupDate || !dropoffDate) return false;
  try {
    return dayjs(dropoffDate).isBefore(dayjs(pickupDate));
  } catch {
    return false;
  }
}

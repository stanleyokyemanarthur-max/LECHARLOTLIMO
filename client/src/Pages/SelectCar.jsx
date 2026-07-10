import React, { useEffect, useState } from "react";
import { motion, AnimatePresence, } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedCar } from "../slices/bookingSlice";
import axios from "axios";
import dayjs from "dayjs";
import {
  Car,
  MapPin,
  Clock,
  Route,
  TrendingDown,
  Banknote
} from "lucide-react";
export default function SelectCar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tripData } = useSelector((state) => state.bookings);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // per-car state system (clean + scalable)
  const [activeCarId, setActiveCarId] = useState(null);
  const [loadingCarId, setLoadingCarId] = useState(null);
  const [estimates, setEstimates] = useState({});
  const [readyCarId, setReadyCarId] = useState(null);

  // redirect safety
  useEffect(() => {
    if (!tripData) navigate("/reserve");
  }, [tripData, navigate]);
  console.log("TRIP DATA:", tripData);

  // reset UI on trip change
  useEffect(() => {
    setActiveCarId(null);
    setLoadingCarId(null);
    setEstimates({});
  }, [tripData?.pickupDate, tripData?.dropoffDate]);

  // fetch cars
  useEffect(() => {
    if (!tripData?.pickupDate || !tripData?.dropoffDate) return;

    const fetchCars = async () => {
      try {
        setLoading(true);
        console.log("FROM", tripData?.pickupDate);
        console.log("TO", tripData?.dropoffDate);
        console.log("AVAILABILITY REQUEST",
          {
            from: tripData.pickupDate,
            to: tripData.dropoffDate,

          });

        const res = await axios.get(
          "https://lecharlotlimo-aucd.onrender.com/api/fleet/availability",
          {
            params: {
              from: new Date(tripData.pickupDate).toISOString(),
              to: new Date(tripData.dropoffDate).toISOString(),
            },
          }
        );
        console.log("AVAILABILITY RESPONSE", res.data);
        console.log("FETCH CARS EFFECT RUNNING");

        setCars(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch vehicles.");
      } finally {
        setLoading(false);
      }
    };

    fetchCars();
  }, [tripData]);



  // get estimate per car
  const handleSelect = async (car) => {
    try {
      setActiveCarId(car._id);
      setLoadingCarId(car._id);
      console.log("========== TRIP DATA FROM REDUX ==========");
      console.log(tripData);

      console.log("========== SENDING ESTIMATE ==========");
      console.log({
        pickup: tripData.pickupLocation,
        dropoff: tripData.dropoffLocation,
        tripType: tripData.tripType,
        returnPickup: tripData.returnPickupLocation,
        returnDropoff: tripData.returnDropoffLocation,
        returnDistance: tripData.returnDistance,
      });

      const res = await axios.post(

        "https://lecharlotlimo-aucd.onrender.com/api/bookings/estimate",
        {
          pickup: tripData.pickupLocation,
          dropoff: tripData.dropoffLocation,
          carId: car._id,

          distance: tripData.distance,

          tripType: tripData.tripType,

          returnPickup:
            tripData.tripType === "roundTrip"
              ? tripData.returnPickupLocation
              : null,

          returnDropoff:
            tripData.tripType === "roundTrip"
              ? tripData.returnDropoffLocation
              : null,

          returnDistance:
            tripData.tripType === "roundTrip"
              ? tripData.returnDistance
              : 0,

        }
      );

      console.log("========== ESTIMATE RESPONSE ==========");
      console.log(res.data);



      setEstimates((prev) => ({
        ...prev,
        [car._id]: {
          ...res.data,
          car,
        },
      }));

      setReadyCarId(car._id);

    } catch (err) {
      console.error(
        "ESTIMATE ERROR:",
        err?.response?.data || err.message
      );

      setError(
        err?.response?.data?.error ||
        "Unable to generate estimate. Please try again."
      );

    } finally {
      setLoadingCarId(null);
    }
  };


  const proceedToBooking = (car, estimate) => {
    dispatch(setSelectedCar(car));

    navigate("/final-details", {
      state: {
        rideInfo: tripData,
        selectedCar: car,
        estimate,
      },
    });
  };

  if (!tripData) return null;

  const format = (d) =>
    d ? dayjs(d).format("MM/DD/YYYY hh:mm A") : "";

  return (
    <div className="min-h-screen bg-[#0B0B0B] mt-10 py-10 px-4 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-[#121212] rounded-2xl p-8 shadow-[0_0_25px_rgba(212,175,55,0.2)]"
      >
        {/* HEADER */}
        <h2 className="text-3xl font-bold text-[#D4AF37] mb-2">
          Step 2 — Select Vehicle
        </h2>

        <p className="text-gray-400 text-sm mb-6">
          Sort By: <span className="text-white font-semibold">Price — Low to High</span>
        </p>

        {/* TRIP SUMMARY */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 mb-8 text-sm text-gray-300 grid md:grid-cols-2 gap-3">
          <p><span className="text-[#D4AF37] font-semibold">Pickup:</span> {tripData.pickupLocation}</p>
          <p><span className="text-[#D4AF37] font-semibold">Drop-off:</span> {tripData.dropoffLocation}</p>
          <p><span className="text-[#D4AF37] font-semibold">Pickup:</span> {format(tripData.pickupDate)}</p>
          <p><span className="text-[#D4AF37] font-semibold">Drop-off:</span> {format(tripData.dropoffDate)}</p>
          <p><span className="text-[#D4AF37] font-semibold">Passengers:</span> {tripData.passengers || "—"}</p>
          <p><span className="text-[#D4AF37] font-semibold">Luggage:</span> {tripData.luggage || "—"}</p>
          <p><span className="text-[#D4AF37] font-semibold">Distance:</span> {tripData.distance?.toFixed(2)} mi</p>
          {tripData.tripType === "roundTrip" && (
            <>
              <p>
                <span className="text-[#D4AF37] font-semibold">
                  Return Pickup:
                </span>{" "}
                {tripData.returnPickupLocation}
              </p>

              <p>
                <span className="text-[#D4AF37] font-semibold">
                  Return Drop-off:
                </span>{" "}
                {tripData.returnDropoffLocation}
              </p>

              <p>
                <span className="text-[#D4AF37] font-semibold">
                  Return Distance:
                </span>{" "}
                {tripData.returnDistance?.toFixed(2)} mi
              </p>
            </>
          )}
        </div>

        {/* STATES */}
        {loading ? (
          <p className="text-gray-400">Loading vehicles…</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : cars.length === 0 ? (
          <p className="text-gray-400">No vehicles available.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => {
              const estimate = estimates[car._id];
              const isActive = activeCarId === car._id;
              const isLoading = loadingCarId === car._id;

              return (
                <motion.div
                  key={car._id}
                  whileHover={{ scale: 1.03 }}
                  className={`bg-[#1E1E1E] rounded-xl overflow-hidden border flex flex-col transition ${isActive
                    ? "border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.25)]"
                    : "border-[#333]"
                    }`}
                >
                  <img
                    src={car.image}
                    className="h-44 w-full object-cover"
                    alt={car.name}
                  />

                  <div className="p-4 flex flex-col flex-1 justify-between">
                    {/* INFO */}
                    <div>
                      <h3 className="text-white font-semibold text-lg">
                        {car.name}
                      </h3>

                      <p className="text-[#D4AF37] text-sm font-medium">
                        {car.availableUnits} available
                      </p>
                      <p className="text-gray-400 text-xs">
                        {car.availableUnits} of {car.totalUnits} vehicles available
                      </p>
                      <p className="text-gray-400 text-sm">
                        {car.seats} Seats • {car.transmission} • {car.fuel}
                      </p>

                      {car.description && (
                        <p className="text-gray-500 text-sm mt-2">
                          {car.description}
                        </p>
                      )}
                    </div>

                    {/* ACTION */}
                    <div className="mt-5">
                      <p className="text-xs text-[#D4AF37] mb-3 tracking-wide uppercase">
                        Personalized Chauffeur Quote
                      </p>

                      <motion.button
                        layout
                        onClick={
                          readyCarId === car._id
                            ? () => proceedToBooking(car, estimates[car._id])
                            : () => handleSelect(car)
                        }
                        disabled={isLoading}
                        className="w-full rounded-full text-black font-semibold py-3 bg-[linear-gradient(145deg,_#7a5a12_0%,_#b8891a_30%,_#f2d27a_40%,_#c79b2a_60%,_#8a6316_80%)]
                        border border-[rgba(255,248,221,0.12)] shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),inset_0_-3px_6px_rgba(0,0,0,0.35),0_12px_30px_rgba(0,0,0,0.35)]
                        transition-all duration-300 hover:brightness-110 hover:scale-[1.02] disabled:opacity-70"
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={
                              isLoading
                                ? "loading"
                                : readyCarId === car._id
                                  ? "continue"
                                  : "estimate"
                            }
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.15 }}
                            className="flex items-center justify-center "
                          >
                            {isLoading
                              ? "Generating Quote..."
                              : readyCarId === car._id
                                ? "Confirm & Continue →"
                                : "View Personalized Quote"}
                          </motion.span>
                        </AnimatePresence>
                      </motion.button>
                    </div>

                    {/* ESTIMATE */}
                    <AnimatePresence>
                      {estimate && isActive && (
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="mt-4 p-4 rounded-xl bg-[#141414] border border-[#D4AF37]/20"
                        >

                          {/* <div className="flex items-center gap-2 text-white font-semibold mb-3">
                            <Car size={16} className="text-[#D4AF37]" />
                            {estimate.car.name}
                          </div> */}


                          <div className="space-y-2 text-sm text-gray-400">
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2">
                                <MapPin size={14} /> Distance
                              </span>
                              <span className="text-white">
                                {Number(estimate.outbound?.distanceMiles || 0).toFixed(2)} mi
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2">
                                <Clock size={14} /> Duration
                              </span>
                              <span className="text-white">
                                {estimate.outbound?.durationText}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2">
                                <Route size={14} /> Traffic Impact
                              </span>
                              <span className="text-white">
                                {estimate.outbound?.trafficDurationText}
                              </span>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2">
                                <TrendingDown size={14} /> Delay
                              </span>
                              <span className="text-white">
                                {estimate.outbound?.trafficDelayPercent || 0}%
                              </span>
                            </div>
                          </div>


                          <div className="mt-4 pt-3 border-t border-[#2A2A2A] flex justify-between items-center">
                            <span className="flex items-center gap-2 text-gray-400">
                              <Banknote size={16} /> Estimated Fare
                            </span>

                            <span className="text-white text-xl font-bold">
                              ${Number(estimate.totalPrice || 0).toFixed(2)}
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
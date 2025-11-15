import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setSelectedCar } from "../slices/bookingSlice";
import axios from "axios";
import dayjs from "dayjs";

export default function SelectCar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tripData } = useSelector((state) => state.bookings);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Redirect if no trip data
  useEffect(() => {
    if (!tripData) navigate("/reserve");
  }, [tripData, navigate]);

  // Fetch available cars
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:5000/api/cars");
        setCars(res.data);
      } catch (err) {
        console.error(err);
        setError("Unable to fetch cars from the server.");
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  // Calculate price based on distance
  const calculatePrice = (car) => {
    const baseRate = 5; // $5 per mile
    const distance = tripData?.distance || 0;
    return (baseRate * distance).toFixed(2);
  };

  // Centralized handle select
  const handleSelect = (car) => {
    const price = calculatePrice(car);
    const carWithPrice = { ...car, price };
    dispatch(setSelectedCar(carWithPrice));
    navigate("/final-details", {
      state: { rideInfo: tripData, selectedCar: carWithPrice },
    });
  };

  if (!tripData) return null;

  const formattedPickup = tripData.pickupDate
    ? dayjs(tripData.pickupDate).format("MM/DD/YYYY hh:mm A")
    : "";
  const formattedDropoff = tripData.dropoffDate
    ? dayjs(tripData.dropoffDate).format("MM/DD/YYYY hh:mm A")
    : "";

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-10 px-4 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl w-full bg-[#121212] shadow-[0_0_25px_rgba(212,175,55,0.2)] rounded-2xl p-8"
      >
        {/* Header */}
        <h2 className="text-3xl font-luxury-gold mb-2 text-[#D4AF37]">
          Step 2 — Select Vehicle
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Sort By: <span className="font-semibold text-white">Price — Low to High</span>
        </p>

        {/* Trip Summary */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 mb-8 text-gray-300">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <p><span className="font-semibold text-[#D4AF37]">Pickup:</span> {tripData.pickupLocation}</p>
            <p><span className="font-semibold text-[#D4AF37]">Drop-off:</span> {tripData.dropoffLocation}</p>
            <p><span className="font-semibold text-[#D4AF37]">Pickup Time:</span> {formattedPickup}</p>
            {tripData.dropoffDate && (
              <p><span className="font-semibold text-[#D4AF37]">Drop-off Time:</span> {formattedDropoff}</p>
            )}
            <p><span className="font-semibold text-[#D4AF37]">Passengers:</span> {tripData.passengers || "—"}</p>
            <p><span className="font-semibold text-[#D4AF37]">Luggage:</span> {tripData.luggage || "—"}</p>
            <p><span className="font-semibold text-[#D4AF37]">Distance:</span> {tripData.distance?.toFixed(2)} mi</p>
          </div>
        </div>

        {/* Cars List */}
        {loading ? (
          <p className="text-gray-400">Loading available vehicles…</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : cars.length === 0 ? (
          <div className="bg-[#1E1E1E] p-6 rounded-lg text-center text-gray-400">
            Sorry, we were unable to determine a vehicle for your ride.
            <br />
            Please contact us at <span className="font-semibold text-[#D4AF37]">(800) 431-0313</span>.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car) => (
              <motion.div
                key={car._id}
                whileHover={{ scale: 1.03 }}
                className="border border-[#333] rounded-xl overflow-hidden bg-[#1E1E1E] flex flex-col shadow-lg"
              >
                <img
                  src={car.image}
                  alt={car.name}
                  className="h-44 w-full object-cover"
                />
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{car.name}</h3>
                    <div className="flex flex-wrap text-sm text-gray-400 mb-2 gap-2">
                      <span>{car.seats} Seats</span>
                      <span>• {car.transmission}</span>
                      <span>• {car.fuel}</span>
                    </div>
                    {car.description && (
                      <p className="text-gray-500 text-sm mb-3">{car.description}</p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold text-[#D4AF37]">
                      ${calculatePrice(car)}
                    </p>

                    <button
                      onClick={() => handleSelect(car)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 px-5 rounded-full transition duration-300"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

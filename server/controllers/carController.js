import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import dayjs from "dayjs";

// ✅ Allowed fields for updates
const CAR_UPDATE_FIELDS = ["name", "type", "seats", "transmission", "fuel", "speed", "perMileRate"];

export const createCar = async (req, res) => {
  try {
    const { name, type, seats, transmission, fuel, speed, perMileRate } = req.body;

    if (!name || !type || !perMileRate) {
      return res.status(400).json({ message: "Name, type, and perMileRate are required" });
    }

    const newCar = new Car({
      name,
      type,
      seats,
      transmission,
      fuel,
      speed,
      perMileRate,
      image: req.file?.path,
    });

    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    console.error("Create car error:", err);
    res.status(500).json({ message: "Error creating car", error: err.message });
  }
};

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (err) {
    console.error("Get cars error:", err);
    res.status(500).json({ message: "Error fetching cars" });
  }
};

export const getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (err) {
    console.error("Get car error:", err);
    res.status(500).json({ message: "Error fetching car" });
  }
};

export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    // Only update allowed fields
    CAR_UPDATE_FIELDS.forEach(field => {
      if (req.body[field] !== undefined) car[field] = req.body[field];
    });

    if (req.file) car.image = req.file.path;

    const updatedCar = await car.save();
    res.json(updatedCar);
  } catch (err) {
    console.error("Update car error:", err);
    res.status(500).json({ message: "Error updating car", error: err.message });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json({ message: "Car deleted successfully" });
  } catch (err) {
    console.error("Delete car error:", err);
    res.status(500).json({ message: "Error deleting car" });
  }
};

export const getAvailableCars = async (req, res) => {
  try {
    const { from, to } = req.query;

    const statusFilter = ["pending", "confirmed", "enroute"];

    let start;
    let end;

    const hasFrom = !!from;
    const hasTo = !!to;

    // -----------------------------
    // 1. Strict validation rules
    // -----------------------------
    if (hasFrom || hasTo) {
      if (!hasFrom || !hasTo) {
        return res.status(400).json({
          message: "Both 'from' and 'to' must be provided together",
        });
      }

      start = new Date(from);
      end = new Date(to);

      if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return res.status(400).json({
          message: "Invalid date format. Use ISO 8601 (UTC recommended).",
        });
      }

      if (start >= end) {
        return res.status(400).json({
          message: "'from' must be earlier than 'to'",
        });
      }
    }

    // -----------------------------
    // 2. Build booking query safely
    // -----------------------------
    const bookingQuery = {
      status: { $in: statusFilter },
    };

    if (start && end) {
      bookingQuery.pickupDate = { $lt: end };
      bookingQuery.dropoffDate = { $gt: start };
    }

    // -----------------------------
    // 3. Find conflicting bookings
    // -----------------------------
    const bookedCars = await Booking.find(bookingQuery)
      .select("car")
      .lean();

    // normalize + deduplicate safely
    const bookedCarIds = [
      ...new Set(
        bookedCars
          .map((b) => b.car)
          .filter(Boolean)
          .map((id) => id.toString())
      ),
    ];

    // -----------------------------
    // 4. Fetch available cars
    // -----------------------------
    const availableCars = await Car.find({
      _id: { $nin: bookedCarIds },
      status: "available",
    })
      .lean()
      .sort({ createdAt: -1 });

    return res.status(200).json(availableCars);
  } catch (err) {
    console.error("Get available cars error:", err);

    return res.status(500).json({
      message: "Failed to fetch available cars",
      error:
        process.env.NODE_ENV === "production"
          ? "Internal server error"
          : err.message,
    });
  }
};
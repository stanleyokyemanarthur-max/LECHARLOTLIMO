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

    if (!from || !to) {
      const cars = await Car.find({ status: "available" });
      return res.json(cars);
    }

    const start = dayjs(from).toDate();
    const end = dayjs(to).toDate();

    const bookedCars = await Booking.find({
      status: { $in: ["pending", "confirmed"] },
      pickupDate: { $lt: end },
      dropoffDate: { $gt: start },
    }).distinct("car");

    const availableCars = await Car.find({
      _id: { $nin: bookedCars },
      status: "available",
    });

    res.json(availableCars);
  } catch (err) {
    console.error("Get available cars error:", err);
    res.status(500).json({ message: "Error checking availability", error: err.message });
  }
};

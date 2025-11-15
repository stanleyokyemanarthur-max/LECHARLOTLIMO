import Car from "../models/Car.js";
import dayjs from "dayjs";

// ✅ Create Car
export const createCar = async (req, res) => {
  try {
    const { name, type, seats, transmission, fuel, speed, perMileRate } = req.body;

    const newCar = new Car({
      name,
      type,
      seats,
      transmission,
      fuel,
      speed,
      perMileRate, // ✅ per-mile pricing
      image: req.file?.path, // Cloudinary URL
    });

    await newCar.save();
    res.status(201).json(newCar);
  } catch (error) {
    res.status(500).json({ message: "Error creating car", error: error.message });
  }
};

// ✅ Get all cars
export const getCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.json(cars);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cars" });
  }
};

// ✅ Get single car
export const getCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });
    res.json(car);
  } catch (error) {
    res.status(500).json({ message: "Error fetching car" });
  }
};

// ✅ Update Car
export const updateCar = async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    car.name = req.body.name || car.name;
    car.type = req.body.type || car.type;
    car.seats = req.body.seats || car.seats;
    car.transmission = req.body.transmission || car.transmission;
    car.fuel = req.body.fuel || car.fuel;
    car.speed = req.body.speed || car.speed;
    car.perMileRate = req.body.perMileRate || car.perMileRate;

    if (req.file) car.image = req.file.path;

    const updatedCar = await car.save();
    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: "Error updating car", error: error.message });
  }
};

// ✅ Delete Car
export const deleteCar = async (req, res) => {
  try {
    const car = await Car.findByIdAndDelete(req.params.id);
    if (!car) return res.status(404).json({ message: "Car not found" });

    res.json({ message: "Car deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting car" });
  }
};

// ✅ Check Available Cars
export const getAvailableCars = async (req, res) => {
  try {
    const { from, to } = req.query;

    // if no dates provided → return all cars
    if (!from || !to) {
      const cars = await Car.find();
      return res.json(cars);
    }

    const selectedFrom = dayjs(from);
    const selectedTo = dayjs(to);

    const cars = await Car.find();

    const availableCars = cars.filter((car) => {
      return car.bookedTimeSlots.every((slot) => {
        const bookingFrom = dayjs(slot.start);
        const bookingTo = dayjs(slot.end);
        const overlaps =
          selectedFrom.isBefore(bookingTo) && selectedTo.isAfter(bookingFrom);
        return !overlaps;
      });
    });

    res.json(availableCars);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error checking availability", error: error.message });
  }
};

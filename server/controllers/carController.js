import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import dayjs from "dayjs";

// ✅ Allowed fields for updates
const CAR_UPDATE_FIELDS = ["name", "type", "seats", "transmission", "fuel", "speed", "perMileRate", "rateMultiplier", "totalUnits", "description", "status"];

export const createCar = async (req, res) => {
  console.log("Incoming fleetKey:", req.body.fleetKey);
  try {
    const { name, type, seats, transmission, fuel, speed, perMileRate, totalUnits } = req.body;

    if (!name || !type || !perMileRate || !req.body.fleetKey) {
      return res.status(400).json({ message: "Name, type, perMileRate, and fleetKey are required" });
    }

    const newCar = new Car({
      name,
      type,
      seats: Number(seats),
      transmission,
      fuel,
      speed,
      perMileRate: Number(perMileRate),
      rateMultiplier: Number(req.body.rateMultiplier ?? 1),

      totalUnits: Number(req.body.totalUnits ?? 1),
      fleetKey: req.body.fleetKey,   // 🔥 REQUIRED for fleet system

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


export const getFleetAvailability = async (req, res) => {
    console.log("=== AVAILABILITY HIT ===");
  console.log(req.query);

  try {
    console.log("STEP 1");

    // first await

    console.log("STEP 2");

    // second await

    console.log("STEP 3");
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ message: "Missing date range" });
    }

    const start = new Date(from);
    const end = new Date(to);

    const activeStatuses = ["pending", "confirmed", "enroute"];

    // 1. Get cars
    const cars = await Car.find().lean();

    // 2. Get overlapping bookings
   const bookings = await Booking.find({
  status: { $in: activeStatuses },
  pickupDate: { $exists: true, $ne: null, $lt: end },
  dropoffDate: { $exists: true, $ne: null, $gt: start },
}).lean();

    // 3. Build fleet usage map (KEY FIX)
    const fleetMap = new Map();

    for (const b of bookings) {
      const key = b.fleetKey || b.carSnapshot?.fleetKey;

      if (!key) continue;

      fleetMap.set(key, (fleetMap.get(key) || 0) + 1);
    }

    // 4. Compute availability per fleetKey
    const result = cars.map((car) => {
      const used = fleetMap.get(car.fleetKey) || 0;

      const availableUnits = Math.max(0, car.totalUnits - used);

      return {
        ...car,
        usedUnits: used,
        availableUnits,
        isSoldOut: availableUnits === 0,
      };
    });

    return res.json(result);

  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
// export const getAvailableCars = async (req, res) => {
//   try {
//     const { from, to } = req.query;

//     if (!from || !to) {
//       return res.status(400).json({ message: "Missing date range" });
//     }

//     const start = new Date(from);
//     const end = new Date(to);

//     const activeStatuses = ["pending", "confirmed", "enroute"];

//     // 1. get all cars
//     const cars = await Car.find({ status: "available" }).lean();

//     // 2. get overlapping bookings ONLY for time window
//     const bookings = await Booking.find({
//       status: { $in: activeStatuses },
//       pickupDate: { $lt: end },
//       dropoffDate: { $gt: start },
//       car: { $ne: null },
//     }).lean();

//     // 3. count bookings per car
//     const bookingMap = new Map();

//     for (const b of bookings) {
//       const id = String(b.car);
//       bookingMap.set(id, (bookingMap.get(id) || 0) + 1);
//     }

//     // 4. compute availability correctly
//     const result = cars.map((car) => {
//       const booked = bookingMap.get(String(car._id)) || 0;

//       const availableUnits = Math.max(0, car.totalUnits - booked);

//       return {
//         ...car,
//         bookedUnits: booked,
//         availableUnits,
//         isSoldOut: availableUnits === 0,
//       };
//     });

//     return res.json(result);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ message: "Failed to fetch cars" });
//   }
// };
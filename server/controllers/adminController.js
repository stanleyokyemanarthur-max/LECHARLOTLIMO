// server/controllers/adminController.js
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import Car from "../models/Car.js";

export const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCars = await Car.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalRevenue = await Booking.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const recentBookings = await Booking.find()
      .populate("car user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalCars,
      totalBookings,
      totalRevenue: totalRevenue[0]?.total || 0,
      recentBookings,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

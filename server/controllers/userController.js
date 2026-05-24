import User from "../models/User.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // exclude passwords
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

export const getDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: "driver", status: "active" })
      .select("_id name email")
      .sort({ name: 1 });

    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching drivers" });
  }
};


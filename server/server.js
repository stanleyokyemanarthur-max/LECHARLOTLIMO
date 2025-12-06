// server.js
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import contactRoutes from "./routes/contactRoute.js";

import authRoutes from "./routes/authRoute.js";
import carRoutes from "./routes/carRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import paymentWebhook from "./routes/paymentWebhook.js";
import cors from "cors";


dotenv.config();
connectDB();

const app = express();
app.use(cors({
  origin: "https://lecharlotlimo.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

const PORT = process.env.PORT || 5000;

// ✅ Webhook route must come BEFORE express.json()
app.use(
  "/api/payments/webhook",
  bodyParser.raw({ type: "application/json" }),
  paymentWebhook
);

// ✅ Regular middleware after webhook

app.use(express.json());

// ✅ Standard routes
app.use("/api/auth", authRoutes);
app.use("/api/cars", carRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => res.send("🚖 LimoProject backend is running..."));

app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);

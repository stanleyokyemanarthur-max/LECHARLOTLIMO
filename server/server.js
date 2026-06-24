// server.js
import express from "express";
import bodyParser from "body-parser";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import cors from "cors";

// Routes
import contactRoutes from "./routes/contactRoute.js";
import authRoutes from "./routes/authRoute.js";
import carRoutes from "./routes/carRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import paymentWebhook from "./routes/paymentWebhook.js";
import adminBroadcastRoutes from "./routes/adminBroadcastRoutes.js";
import rewardRoutes from "./routes/rewardRoutes.js";
import adminRewardsRoutes from "./routes/adminRewardsRoute.js";
import adminMilestoneRoutes from "./routes/adminMilestone.routes.js";
// Jobs
import { birthdayRewardJob } from "./jobs/birthdayRewards.js";
import { expireRewardsJob } from "./jobs/expireRewards.js";
import { rewardCleanupJob } from "./jobs/rewardCleanup.js";
import "./jobs/index.js"; // to start the booking expiration job
// Initialize dotenv
dotenv.config();

// Start server function
const startServer = async () => {
  try {
    // 1️⃣ Connect to MongoDB
    await connectDB();
    console.log("✅ MongoDB connected");

    // 2️⃣ Run cron jobs AFTER DB connection
    await birthdayRewardJob(); // run immediately on startup
    expireRewardsJob();         // scheduled inside job file
    rewardCleanupJob();         // scheduled inside job file

    // 3️⃣ Initialize Express
    const app = express();

   const allowedOrigins = [
  "https://www.lecharlotlimousine.com",
  "https://lecharlotlimo.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like Postman or server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// handle preflight explicitly
app.options("*", cors());

    app.set("trust proxy", 1);

    const PORT = process.env.PORT || 5000;

    // 4️⃣ Webhook route must come BEFORE express.json()
    app.use(
      "/api/payments/webhook",
      bodyParser.raw({ type: "application/json" }),
      paymentWebhook
    );
    // 5️⃣ Regular middleware
    app.use(express.json());
    
    // 6️⃣ Standard API routes
    app.use(express.static("public"));
    app.use("/api/auth", authRoutes);
    app.use("/api/fleet", carRoutes);
    app.use("/api/admin", adminRoutes);
    app.use("/api/bookings", bookingRoutes);
    app.use("/api/users", userRoutes);
    app.use("/api/payments", paymentRoutes);
    app.use("/api/contact", contactRoutes);
    app.use("/api/admin", adminBroadcastRoutes);
    app.use("/api/rewards", rewardRoutes);
    app.use("/api/admin", adminRewardsRoutes);
    app.use("/api/admin/milestones", adminMilestoneRoutes);

    // Root route
    app.get("/", (req, res) =>
      res.send("🚖 LimoProject backend is running...")
    );

    // 7️⃣ Start server
    app.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  } catch (err) {
    console.error("❌ Server startup failed:", err);
    process.exit(1); // exit process if DB fails
  }
};

// Launch
startServer();

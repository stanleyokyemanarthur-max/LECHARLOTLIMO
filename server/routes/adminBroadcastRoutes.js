import express from "express";
import { broadcastMessage } from "../controllers/adminBroadcastController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/broadcast", protect, adminOnly, broadcastMessage);

export default router;

import express from "express";
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "../controllers/paypalController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, createPayPalOrder);
router.post("/capture-order", protect, capturePayPalOrder);

export default router;
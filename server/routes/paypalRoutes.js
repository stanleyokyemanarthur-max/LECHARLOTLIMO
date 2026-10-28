import express from "express";
import {
  createPayPalOrder,
  capturePayPalOrder,
} from "../controllers/paypalController.js";
import { protect, customerOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-order", protect, customerOnly, createPayPalOrder);
router.post("/capture-order", protect, customerOnly, capturePayPalOrder);

export default router;
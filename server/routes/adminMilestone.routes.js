import express from "express";
import {
  getMilestones,
  createMilestone,
  updateMilestone,
  deleteMilestone,
  toggleMilestone,
} from "../controllers/adminMilestone.controller.js";

import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ First authenticate, then check admin
router.use(protect, adminOnly);

router.get("/", getMilestones);
router.post("/", createMilestone);
router.put("/:id", updateMilestone);
router.patch("/:id/toggle", toggleMilestone);
router.delete("/:id", deleteMilestone);

export default router;

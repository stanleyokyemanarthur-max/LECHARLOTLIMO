import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { requireAdmin } from "../middleware/adminMiddleware.js";
import {
  adminGetAllRewards,
  adminUpdateRewardStatus,
  adminMarkRewardUsed,
  adminUnlockReward,
} from "../controllers/adminRewardController.js";

const router = express.Router();

// Admin-only: view all rewards
router.get("/rewards", protect, requireAdmin, adminGetAllRewards);

// Admin-only: update reward status
router.patch("/rewards/:id", protect, requireAdmin, adminUpdateRewardStatus);

// Admin-only: unlock queued reward
router.patch("/rewards/:id/unlock", protect, requireAdmin, adminUnlockReward);

// Admin-only: mark reward as USED
router.patch("/rewards/:id/mark-used", protect, requireAdmin, adminMarkRewardUsed);

export default router;

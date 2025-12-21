import express from "express";
import {
  getMyRewards,
  lockReward,
} from "../controllers/rewardController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/my", protect, getMyRewards);
router.post("/:id/lock", protect, lockReward);

export default router;

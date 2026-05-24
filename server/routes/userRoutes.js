import express from "express";
import { getAllUsers } from "../controllers/userController.js";
import {getDrivers} from '../controllers/userController.js'
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.get("/drivers", protect, adminOnly, getDrivers);


export default router;

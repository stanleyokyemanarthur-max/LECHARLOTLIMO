import express from "express";
import { contactForm} from "../controllers/contactController.js";

const router = express.Router();

// POST /api/contact
router.post("/", contactForm);

export default router;

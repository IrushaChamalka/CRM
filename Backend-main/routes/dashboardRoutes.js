import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// GET /api/dashboard
router.get("/", protect, getDashboardStats);

export default router;

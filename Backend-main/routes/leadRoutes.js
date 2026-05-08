import express from "express";
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  updateLeadStatus,
} from "../controllers/leadController.js";
import { getNotes, addNote } from "../controllers/noteController.js";
import protect from "../middleware/auth.js";

const router = express.Router();

// Lead routes - all protected
router.get("/", protect, getLeads);
router.post("/", protect, createLead);
router.get("/:id", protect, getLeadById);
router.put("/:id", protect, updateLead);
router.delete("/:id", protect, deleteLead);
router.patch("/:id/status", protect, updateLeadStatus);

// Note routes nested under leads - all protected
router.get("/:id/notes", protect, getNotes);
router.post("/:id/notes", protect, addNote);

export default router;

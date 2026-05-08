import Note from "../models/Note.js";
import Lead from "../models/Lead.js";

// @desc    Get notes for a lead
// @route   GET /api/leads/:id/notes
// @access  Private
export const getNotes = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const notes = await Note.find({ leadId: req.params.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    console.error("Get notes error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Add a note to a lead
// @route   POST /api/leads/:id/notes
// @access  Private
export const addNote = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Please provide note content" });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const note = await Note.create({
      leadId: req.params.id,
      content,
      createdBy: req.user.name,
    });

    res.status(201).json(note);
  } catch (error) {
    console.error("Add note error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

import Lead from "../models/Lead.js";
import Note from "../models/Note.js";

// @desc    Get all leads with optional filters
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res) => {
  try {
    const { status, source, salesperson, search } = req.query;
    const filter = {};

    if (status) filter.status = status;
    if (source) filter.source = source;
    if (salesperson) filter.assignedTo = salesperson;

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const leads = await Lead.find(filter).sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error("Get leads error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get single lead by ID
// @route   GET /api/leads/:id
// @access  Private
export const getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    res.json(lead);
  } catch (error) {
    console.error("Get lead error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req, res) => {
  try {
    const { name, company, email, phone, source, assignedTo, status, dealValue } = req.body;

    if (!name || !company || !email || !assignedTo) {
      return res.status(400).json({
        message: "Please provide name, company, email, and assigned salesperson",
      });
    }

    const lead = await Lead.create({
      name,
      company,
      email,
      phone: phone || "",
      source: source || "Other",
      assignedTo,
      status: status || "New",
      dealValue: dealValue || 0,
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error("Create lead error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );

    res.json(updatedLead);
  } catch (error) {
    console.error("Update lead error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Lead not found" });
    }
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    // Delete associated notes
    await Note.deleteMany({ leadId: req.params.id });
    await Lead.findByIdAndDelete(req.params.id);

    res.json({ message: "Lead deleted successfully" });
  } catch (error) {
    console.error("Delete lead error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update lead status
// @route   PATCH /api/leads/:id/status
// @access  Private
export const updateLeadStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Please provide a status" });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: "Lead not found" });
    }

    lead.status = status;
    await lead.save();

    res.json(lead);
  } catch (error) {
    console.error("Update status error:", error);
    if (error.kind === "ObjectId") {
      return res.status(404).json({ message: "Lead not found" });
    }
    res.status(500).json({ message: "Server error" });
  }
};

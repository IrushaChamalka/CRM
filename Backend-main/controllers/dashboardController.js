import Lead from "../models/Lead.js";

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await Lead.countDocuments();
    const newLeads = await Lead.countDocuments({ status: "New" });
    const contactedLeads = await Lead.countDocuments({ status: "Contacted" });
    const qualifiedLeads = await Lead.countDocuments({ status: "Qualified" });
    const proposalSentLeads = await Lead.countDocuments({ status: "Proposal Sent" });
    const wonLeads = await Lead.countDocuments({ status: "Won" });
    const lostLeads = await Lead.countDocuments({ status: "Lost" });

    // Calculate total estimated deal value
    const totalDealValueResult = await Lead.aggregate([
      { $group: { _id: null, total: { $sum: "$dealValue" } } },
    ]);
    const totalDealValue = totalDealValueResult.length > 0 ? totalDealValueResult[0].total : 0;

    // Calculate total value of won deals
    const wonDealValueResult = await Lead.aggregate([
      { $match: { status: "Won" } },
      { $group: { _id: null, total: { $sum: "$dealValue" } } },
    ]);
    const wonDealValue = wonDealValueResult.length > 0 ? wonDealValueResult[0].total : 0;

    // Leads by source
    const leadsBySource = await Lead.aggregate([
      { $group: { _id: "$source", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Recent leads
    const recentLeads = await Lead.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      proposalSentLeads,
      wonLeads,
      lostLeads,
      totalDealValue,
      wonDealValue,
      leadsBySource,
      recentLeads,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

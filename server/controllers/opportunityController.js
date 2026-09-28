const Opportunity = require("../models/Opportunity");

// GET /api/opportunities  (public — anyone can browse)
// Supports optional ?search=&category=&mode= query params for filtering
// on the server too (not required, but nice once you have real data).
async function getOpportunities(req, res) {
  try {
    const { search, category, mode } = req.query;
    const filter = {};
    if (search) filter.title = { $regex: search, $options: "i" };
    if (category) filter.category = category;
    if (mode) filter.mode = mode;

    const opportunities = await Opportunity.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, data: opportunities });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load opportunities", error: error.message });
  }
}

// GET /api/opportunities/:id  (public)
async function getOpportunityById(req, res) {
  try {
    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: "Opportunity not found" });
    }
    res.json({ success: true, data: opportunity });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load opportunity", error: error.message });
  }
}

// POST /api/opportunities  (admin only — protected in the route file)
async function createOpportunity(req, res) {
  try {
    const opportunity = await Opportunity.create(req.body);
    res.status(201).json({ success: true, data: opportunity });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to create opportunity", error: error.message });
  }
}

// PUT /api/opportunities/:id  (admin only)
async function updateOpportunity(req, res) {
  try {
    const opportunity = await Opportunity.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return the updated document
      runValidators: true,
    });
    if (!opportunity) {
      return res.status(404).json({ success: false, message: "Opportunity not found" });
    }
    res.json({ success: true, data: opportunity });
  } catch (error) {
    res.status(400).json({ success: false, message: "Failed to update opportunity", error: error.message });
  }
}

// DELETE /api/opportunities/:id  (admin only)
async function deleteOpportunity(req, res) {
  try {
    const opportunity = await Opportunity.findByIdAndDelete(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ success: false, message: "Opportunity not found" });
    }
    res.json({ success: true, message: "Opportunity deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to delete opportunity", error: error.message });
  }
}

module.exports = {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
};

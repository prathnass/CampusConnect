const Application = require("../models/Application");

// POST /api/applications  (logged-in student)
// req.user.id comes from the JWT (set by the `protect` middleware),
// so a student can only ever apply as themselves — never impersonate
// another user.
async function applyToOpportunity(req, res) {
  try {
    const { opportunityId, coverNote } = req.body;
    if (!opportunityId) {
      return res.status(400).json({ success: false, message: "opportunityId is required" });
    }

    // Prevent applying twice to the same opportunity.
    const existing = await Application.findOne({ userId: req.user.id, opportunityId });
    if (existing) {
      return res.status(409).json({ success: false, message: "You already applied to this opportunity" });
    }

    const application = await Application.create({
      userId: req.user.id,
      opportunityId,
      coverNote,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to submit application", error: error.message });
  }
}

// GET /api/applications/my  (logged-in student — their own applications)
async function getMyApplications(req, res) {
  try {
    const applications = await Application.find({ userId: req.user.id })
      .populate("opportunityId", "title organization deadline") // pulls in opportunity details
      .sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load applications", error: error.message });
  }
}

// GET /api/applications  (admin only — every application, for review)
async function getAllApplications(req, res) {
  try {
    const applications = await Application.find()
      .populate("userId", "name email")
      .populate("opportunityId", "title organization")
      .sort({ createdAt: -1 });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to load applications", error: error.message });
  }
}

// PUT /api/applications/:id/status  (admin only)
async function updateApplicationStatus(req, res) {
  try {
    const { status } = req.body;
    const allowed = ["Applied", "Under Review", "Selected", "Rejected"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value" });
    }

    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ success: false, message: "Application not found" });
    }
    res.json({ success: true, data: application });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to update status", error: error.message });
  }
}

module.exports = {
  applyToOpportunity,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
};

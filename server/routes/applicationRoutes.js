const express = require("express");
const router = express.Router();
const {
  applyToOpportunity,
  getMyApplications,
  getAllApplications,
  updateApplicationStatus,
} = require("../controllers/applicationController");
const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

// IMPORTANT: put "/my" ABOVE any "/:id" style route so Express doesn't
// mistake the word "my" for an :id parameter.
router.get("/my", protect, getMyApplications);
router.post("/", protect, applyToOpportunity);

router.get("/", protect, adminOnly, getAllApplications);
router.put("/:id/status", protect, adminOnly, updateApplicationStatus);

module.exports = router;

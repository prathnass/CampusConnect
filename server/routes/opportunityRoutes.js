const express = require("express");
const router = express.Router();
const {
  getOpportunities,
  getOpportunityById,
  createOpportunity,
  updateOpportunity,
  deleteOpportunity,
} = require("../controllers/opportunityController");
const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");

// Public — anyone can browse opportunities, no login required.
router.get("/", getOpportunities);
router.get("/:id", getOpportunityById);

// Protected + admin-only — must be logged in AND have role "admin".
// `protect` runs first (checks the token), then `adminOnly` (checks the role).
router.post("/", protect, adminOnly, createOpportunity);
router.put("/:id", protect, adminOnly, updateOpportunity);
router.delete("/:id", protect, adminOnly, deleteOpportunity);

module.exports = router;

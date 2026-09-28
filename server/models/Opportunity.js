const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    organization: { type: String, required: true },
    description: String,
    category: String, // e.g. "Web Development", "Data Science"
    mode: { type: String, enum: ["Remote", "Hybrid", "On-site"] },
    location: String,
    skills: [String],
    eligibility: String,
    deadline: Date,
    type: String, // e.g. "Internship", "Hackathon", "Workshop"
  },
  { timestamps: true }
);

module.exports = mongoose.model("Opportunity", opportunitySchema);

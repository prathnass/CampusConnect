// This is the "join" model that connects a User to an Opportunity.
// We do NOT store applications inside the User document because:
// 1. A user can apply to many opportunities, and an opportunity can have
//    many applicants — that's a many-to-many relationship, which is
//    modeled with a separate collection referencing both sides.
// 2. It keeps the User document small and fast to load.
// 3. It lets us query "all applications for this opportunity" (for the
//    admin) just as easily as "all applications for this user" (for the
//    student dashboard), without digging through unrelated documents.
const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    opportunityId: { type: mongoose.Schema.Types.ObjectId, ref: "Opportunity", required: true },
    status: {
      type: String,
      enum: ["Applied", "Under Review", "Selected", "Rejected"],
      default: "Applied",
    },
    coverNote: String,
  },
  { timestamps: true } // timestamps.createdAt doubles as "appliedAt"
);

module.exports = mongoose.model("Application", applicationSchema);

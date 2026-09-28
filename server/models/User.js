// A "model" describes the shape of a document in a MongoDB collection.
// Mongoose uses this schema to validate data and give us convenient
// methods like User.find(), User.create(), etc.
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    // NOTE: this will store a bcrypt HASH, never the plain password.
    password: { type: String, required: true },
    college: String,
    course: String,
    graduationYear: Number,
    skills: [String],
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
  },
  { timestamps: true } // adds createdAt / updatedAt automatically
);

module.exports = mongoose.model("User", userSchema);

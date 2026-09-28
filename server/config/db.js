// This file's only job is to connect to MongoDB using the connection
// string stored in your .env file (MONGO_URI). Keeping it separate from
// server.js keeps server.js clean and makes the connection reusable.
const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // If we can't connect to the DB, there's no point running the server.
    process.exit(1);
  }
}

module.exports = connectDB;

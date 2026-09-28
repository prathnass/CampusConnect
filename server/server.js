const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const opportunityRoutes = require("./routes/opportunityRoutes");
const applicationRoutes = require("./routes/applicationRoutes");

const app = express();

// Connect to MongoDB before anything else.
connectDB();

// Middleware that runs on every request:
app.use(cors());          // allows the React app (different port) to call this API
app.use(express.json());  // parses incoming JSON request bodies into req.body

// Health check — useful to confirm the server is alive.
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "CampusConnect API is running" });
});

// Mount each set of routes under its own URL prefix.
app.use("/api/auth", authRoutes);
app.use("/api/opportunities", opportunityRoutes);
app.use("/api/applications", applicationRoutes);

// Catch-all error handler — if any route throws unexpectedly, this
// sends a clean JSON error instead of crashing the server.
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Something went wrong" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

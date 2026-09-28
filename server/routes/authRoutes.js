// Routes just wire a URL + HTTP method to a controller function.
// Keeping routes thin (no logic here) makes the app much easier to read.
const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

module.exports = router;

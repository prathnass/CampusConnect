// "Middleware" is a function that runs BEFORE your route handler.
// This one checks that the request has a valid JWT (JSON Web Token) in
// the Authorization header, proving the user is logged in. If the token
// is missing or invalid, we stop the request here with a 401 error.
const jwt = require("jsonwebtoken");

function protect(req, res, next) {
  const authHeader = req.headers.authorization; // expected format: "Bearer <token>"

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, message: "Not authorized, no token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach the decoded user info to the request so later handlers can use it.
    req.user = decoded; // { id, role }
    next(); // pass control to the next middleware / route handler
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, token invalid" });
  }
}

module.exports = protect;

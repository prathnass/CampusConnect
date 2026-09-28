// This middleware must run AFTER `protect`, because it relies on
// req.user having already been set. It blocks anyone whose role isn't
// "admin" — this is what stops a normal student from creating or
// deleting opportunities.
function adminOnly(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  return res.status(403).json({ success: false, message: "Admin access required" });
}

module.exports = adminOnly;

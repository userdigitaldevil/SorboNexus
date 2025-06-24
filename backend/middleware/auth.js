const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function isAdmin(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = { isAdmin };

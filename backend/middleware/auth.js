const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Enhanced token validation
function validateToken(token) {
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw error;
  }
}

// Admin authentication middleware
async function isAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No valid token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = validateToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === "Token expired") {
      return res.status(401).json({ error: "Token expired" });
    }
    if (error.message === "Invalid token") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Authentication error" });
  }
}

// User authentication middleware (for alumni editing their own profiles)
async function isAuthenticated(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No valid token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = validateToken(token);

    if (!decoded) {
      return res.status(401).json({ error: "Invalid token" });
    }

    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("alumni");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    if (error.message === "Token expired") {
      return res.status(401).json({ error: "Token expired" });
    }
    if (error.message === "Invalid token") {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.status(500).json({ error: "Authentication error" });
  }
}

// Optional authentication (for public routes that can show different content for logged users)
async function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      req.user = null;
      return next();
    }

    const token = authHeader.split(" ")[1];
    const decoded = validateToken(token);

    if (!decoded) {
      req.user = null;
      return next();
    }

    const user = await User.findById(decoded.id)
      .select("-password")
      .populate("alumni");
    req.user = user || null;
    next();
  } catch (error) {
    req.user = null;
    next();
  }
}

module.exports = { isAdmin, isAuthenticated, optionalAuth };

const express = require("express");
const Alumni = require("../models/Alumni");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { isAdmin } = require("../middleware/auth");
const router = express.Router();
const bcrypt = require("bcryptjs");

// Middleware to check JWT
function auth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Get all alumni (public)
router.get("/", async (req, res) => {
  const alumni = await Alumni.find();
  res.json(alumni);
});

// Get one alumni (public)
router.get("/:id", async (req, res) => {
  const alumni = await Alumni.findById(req.params.id);
  res.json(alumni);
});

// Update alumni (admin or self)
router.put("/:id", async (req, res) => {
  console.log("PUT /api/alumni/:id route hit");
  try {
    // Authenticate user
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ error: "No token provided" });
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Allow if admin or owner of alumni card
    if (!decoded.isAdmin && decoded.alumniId !== req.params.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    console.log("[PUT /api/alumni/:id] req.params.id =", req.params.id);
    console.log("[PUT /api/alumni/:id] req.body =", req.body);
    // Only pick allowed fields
    const allowedFields = [
      "name",
      "degree",
      "position",
      "field",
      "gradient",
      "color",
      "linkedin",
      "email",
      "avatar",
      "isAdmin",
      "profile",
      "conseil",
      "hidden",
      "nationalities",
      "stagesWorkedContestsExtracurriculars",
      "accountCreationDate",
      "futureGoals",
      "anneeFinL3",
    ];
    const update = {};
    for (const key of allowedFields) {
      if (req.body[key] !== undefined) update[key] = req.body[key];
    }
    // Debug: log the update object
    console.log("Backend update object:", update);
    // Log before update
    const before = await Alumni.findById(req.params.id);
    console.log("[PUT /api/alumni/:id] BEFORE UPDATE:", before);
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { $set: update },
      { new: true, runValidators: true }
    );
    // Log after update
    console.log("[PUT /api/alumni/:id] AFTER UPDATE:", alumni);
    if (!alumni) return res.status(404).json({ error: "Alumni not found" });
    res.json(alumni);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create alumni (admin only)
router.post("/", auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Forbidden" });
  try {
    const {
      username,
      password,
      isAdmin: isAdminNewUser = false,
      ...alumniData
    } = req.body;
    if (!username || !password) {
      console.error("[Alumni POST] Missing username or password");
      return res
        .status(400)
        .json({ error: "Username and password are required" });
    }
    // Check for duplicate username
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      console.error("[Alumni POST] Username already exists:", username);
      return res.status(409).json({ error: "Username already exists" });
    }
    // Create Alumni first
    let alumni;
    try {
      alumni = await Alumni.create(alumniData);
      console.log("[Alumni POST] Alumni created:", alumni._id);
    } catch (err) {
      console.error("[Alumni POST] Error creating Alumni:", err);
      return res
        .status(500)
        .json({ error: "Failed to create Alumni", details: err.message });
    }
    // Hash password
    let hash;
    try {
      hash = await bcrypt.hash(password, 10);
      console.log("[Alumni POST] Password hashed");
    } catch (err) {
      console.error("[Alumni POST] Error hashing password:", err);
      await Alumni.findByIdAndDelete(alumni._id);
      return res
        .status(500)
        .json({ error: "Failed to hash password", details: err.message });
    }
    // Create User linked to Alumni
    let user;
    try {
      user = await User.create({
        username,
        password: hash,
        isAdmin: isAdminNewUser,
        alumni: alumni._id,
      });
      console.log("[Alumni POST] User created:", user._id);
    } catch (err) {
      console.error("[Alumni POST] Error creating User:", err);
      await Alumni.findByIdAndDelete(alumni._id);
      return res
        .status(500)
        .json({ error: "Failed to create User", details: err.message });
    }
    res.json({ alumni, user });
  } catch (err) {
    console.error("[Alumni POST] Unexpected error:", err);
    res.status(500).json({ error: "Unexpected error", details: err.message });
  }
});

// TEMPORARY: Test user creation directly
router.post("/test-user", async (req, res) => {
  try {
    const { username, password, isAdmin = false, alumni } = req.body;
    const bcrypt = require("bcryptjs");
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hash,
      isAdmin,
      alumni,
    });
    res.json({ user });
  } catch (err) {
    console.error("User creation error:", err);
    res.status(500).json({ error: err.message, details: err });
  }
});

// Delete alumni (admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    // Delete the alumni
    const alumni = await Alumni.findByIdAndDelete(req.params.id);
    if (!alumni) return res.status(404).json({ message: "Alumni not found" });
    // Delete the associated user
    await User.deleteOne({ alumni: req.params.id });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toggle alumni profile visibility
router.patch("/:id/hidden", auth, async (req, res) => {
  try {
    // Only allow the owner or an admin to update
    if (!req.user.isAdmin && req.user.alumni.toString() !== req.params.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const { hidden } = req.body;
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { hidden: !!hidden },
      { new: true }
    );
    if (!alumni) return res.status(404).json({ error: "Not found" });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

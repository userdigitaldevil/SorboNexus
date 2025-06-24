const express = require("express");
const Alumni = require("../models/Alumni");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { isAdmin } = require("../middleware/auth");
const router = express.Router();

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
    const alumni = await Alumni.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!alumni) return res.status(404).json({ error: "Alumni not found" });
    res.json(alumni);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Create alumni (admin only)
router.post("/", auth, async (req, res) => {
  if (!req.user.isAdmin) return res.status(403).json({ error: "Forbidden" });
  const alumni = await Alumni.create(req.body);
  res.json(alumni);
});

// Delete alumni (admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  await Alumni.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;

console.log("=== USING AUTH.JS FROM:", __filename);
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Alumni = require("../models/Alumni");
const router = express.Router();

// Register (disabled by admin)
router.post("/register", (req, res) => {
  res
    .status(403)
    .json({ error: "Registration is disabled. Please contact the admin." });
});

// Login
router.post("/login", async (req, res) => {
  console.log("DEBUG: Login route hit. req.body =", req.body);
  try {
    console.log("Login attempt:", req.body);
    const { username, password } = req.body;
    const user = await User.findOne({ username }).populate("alumni");
    console.log("DEBUG: user =", user);
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });
    console.log("User found:", user);
    console.log(
      "DEBUG: About to sign JWT. user.alumni =",
      user.alumni,
      "type:",
      typeof user.alumni
    );
    if (user.alumni && typeof user.alumni === "object" && user.alumni._id) {
      console.log("DEBUG: user.alumni._id =", user.alumni._id);
    }
    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
        alumniId:
          user.alumni && typeof user.alumni === "object" && user.alumni._id
            ? user.alumni._id
            : null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        username: user.username,
        isAdmin: user.isAdmin,
        alumni: user.alumni,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

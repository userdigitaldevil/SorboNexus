console.log("=== USING AUTH.JS FROM:", __filename);
const express = require("express");
const rateLimit = require("express-rate-limit");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isAdmin } = require("../middleware/auth");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Rate limiter for login endpoint
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    error:
      "Trop de tentatives de connexion. Veuillez réessayer dans une minute.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Register (disabled by admin)
router.post("/register", (req, res) => {
  res
    .status(403)
    .json({ error: "Registration is disabled. Please contact the admin." });
});

// Login
router.post("/login", loginLimiter, async (req, res) => {
  console.log("DEBUG: Login route hit. req.body =", req.body);
  try {
    console.log("Login attempt:", req.body);
    const { username, password } = req.body;
    const user = await prisma.user.findUnique({
      where: { username },
      include: {
        alumni: {
          include: {
            grades: true,
            schoolsApplied: true,
          },
        },
      },
    });
    console.log("DEBUG: user =", user);
    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(400).json({ error: "Invalid credentials" });
    console.log("User found:", user);
    console.log(
      "DEBUG: About to sign JWT. user.alumni =",
      user.alumni,
      "type:",
      typeof user.alumni
    );
    if (user.alumni && typeof user.alumni === "object" && user.alumni.id) {
      console.log("DEBUG: user.alumni.id =", user.alumni.id);
    }
    const safeUser = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
      alumni: user.alumni
        ? {
            id: user.alumni.id,
            name: user.alumni.name,
            degree: user.alumni.degree,
            position: user.alumni.position,
            field: user.alumni.field,
            gradient: user.alumni.gradient,
            color: user.alumni.color,
            linkedin: user.alumni.linkedin,
            email: user.alumni.email,
            avatar: user.alumni.avatar,
            isAdmin: user.alumni.isAdmin,
            conseil: user.alumni.conseil,
            nationalities: user.alumni.nationalities,
            updatedAt: user.alumni.updatedAt,
            stagesWorkedContestsExtracurriculars:
              user.alumni.stagesWorkedContestsExtracurriculars,
            accountCreationDate: user.alumni.accountCreationDate,
            hidden: user.alumni.hidden,
            futureGoals: user.alumni.futureGoals,
            anneeFinL3: user.alumni.anneeFinL3,
            grades: user.alumni.grades,
            schoolsApplied: user.alumni.schoolsApplied,
          }
        : null,
    };
    const token = jwt.sign(
      {
        id: safeUser.id,
        isAdmin: safeUser.isAdmin,
        alumniId:
          safeUser.alumni &&
          typeof safeUser.alumni === "object" &&
          safeUser.alumni.id
            ? safeUser.alumni.id
            : null,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

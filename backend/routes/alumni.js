const express = require("express");
const jwt = require("jsonwebtoken");
const { isAdmin } = require("../middleware/auth");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

// Middleware to allow admin or self
function canEditAlumni(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token" });
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    // Allow admin or self (fix: use alumniId)
    if (user.isAdmin || String(user.alumniId) === String(req.params.id)) {
      req.user = user;
      return next();
    }
    return res.status(403).json({ error: "Forbidden" });
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

// Password strength validator
function isStrongPassword(password) {
  // At least 8 chars, 1 uppercase, 1 number, 1 symbol
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
    password
  );
}

// GET all alumni
router.get("/", async (req, res) => {
  try {
    const alumni = await prisma.alumni.findMany({
      include: { grades: true, schoolsApplied: true },
    });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alumni" });
  }
});

// GET single alumni by ID
router.get("/:id", async (req, res) => {
  try {
    const alumni = await prisma.alumni.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { grades: true, schoolsApplied: true, users: true },
    });
    if (!alumni) return res.status(404).json({ error: "Alumni not found" });
    // If there is a user, attach the username (first user for now)
    let username = null;
    if (alumni.users && alumni.users.length > 0) {
      username = alumni.users[0].username;
    }
    res.json({ ...alumni, username });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch alumni" });
  }
});

// UPDATE alumni by ID (admin or self)
router.put("/:id", canEditAlumni, async (req, res) => {
  try {
    // Destructure and remove non-Alumni fields
    const {
      grades,
      schoolsApplied,
      updatedAt,
      username,
      newPassword,
      ...alumniData
    } = req.body;
    // Remove any forbidden fields from alumniData
    const forbiddenFields = ["username", "newPassword", "password", "users"];
    for (const field of forbiddenFields) {
      if (alumniData.hasOwnProperty(field)) {
        delete alumniData[field];
      }
    }
    // Update alumni
    const alumni = await prisma.alumni.update({
      where: { id: parseInt(req.params.id) },
      data: {
        ...alumniData,
        grades: grades
          ? {
              deleteMany: {},
              create: grades,
            }
          : undefined,
        schoolsApplied: schoolsApplied
          ? {
              deleteMany: {},
              create: schoolsApplied,
            }
          : undefined,
      },
      include: { grades: true, schoolsApplied: true, users: true },
    });
    // Update username and/or password if provided (for first user)
    if (username || newPassword) {
      if (!alumni.users || alumni.users.length === 0) {
        return res.status(400).json({
          error:
            "No user found for this alumni to update username or password.",
        });
      }
      const userId = alumni.users[0].id;
      const userUpdate = {};
      if (username) userUpdate.username = username;
      if (newPassword) {
        if (!isStrongPassword(newPassword)) {
          return res
            .status(400)
            .json({ error: "Le mot de passe n'est pas assez fort." });
        }
        userUpdate.password = await bcrypt.hash(newPassword, 10);
      }
      await prisma.user.update({
        where: { id: userId },
        data: userUpdate,
      });
    }
    res.json(alumni);
  } catch (err) {
    console.error("Alumni update error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// CREATE new alumni (admin only)
router.post("/", isAdmin, async (req, res) => {
  try {
    const { grades, schoolsApplied, username, password, ...alumniData } =
      req.body;
    // Remove id if present to avoid unique constraint errors
    if (alumniData.hasOwnProperty("id")) {
      delete alumniData.id;
    }
    let userData = undefined;
    if (username && password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userData = {
        create: {
          username,
          password: hashedPassword,
          isAdmin: alumniData.isAdmin || false,
        },
      };
    }
    const alumni = await prisma.alumni.create({
      data: {
        ...alumniData,
        grades: grades ? { create: grades } : undefined,
        schoolsApplied: schoolsApplied ? { create: schoolsApplied } : undefined,
        users: userData,
      },
      include: { users: true },
    });
    res.status(201).json(alumni);
  } catch (err) {
    console.error("[ERROR] Failed to create alumni:", err);
    res.status(500).json({ error: err.message || "Failed to create alumni" });
  }
});

// DELETE alumni by ID (admin only)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const alumniId = parseInt(req.params.id);
    // Delete all related grades and schools
    await prisma.grade.deleteMany({ where: { alumniId } });
    await prisma.schoolApplied.deleteMany({ where: { alumniId } });
    // Delete all users associated with this alumni
    await prisma.user.deleteMany({ where: { alumniId } });
    // Delete the alumni
    await prisma.alumni.delete({ where: { id: alumniId } });
    res.json({ message: "Alumni deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete alumni" });
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
    const alumni = await prisma.alumni.update({
      where: { id: parseInt(req.params.id) },
      data: { hidden: !!hidden },
    });
    if (!alumni) return res.status(404).json({ error: "Not found" });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

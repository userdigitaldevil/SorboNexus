const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { authenticateToken, requireAdmin } = require("../middleware/auth");

// Get a setting by key
router.get("/:key", async (req, res) => {
  const { key } = req.params;
  try {
    const setting = await prisma.setting.findUnique({ where: { key } });
    if (!setting) {
      return res.status(404).json({ error: "Setting not found" });
    }
    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

// Set a setting by key (admin only)
router.post("/:key", authenticateToken, requireAdmin, async (req, res) => {
  const { key } = req.params;
  const { value } = req.body;
  if (typeof value !== "string") {
    return res.status(400).json({ error: "Value must be a string" });
  }
  try {
    const setting = await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    res.json({ key: setting.key, value: setting.value });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

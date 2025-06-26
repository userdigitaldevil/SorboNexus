const express = require("express");
// Removed: const Alumni = require("../models/Alumni");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const router = express.Router();

// GET /api/conseils - return all conseils from alumni
router.get("/", async (req, res) => {
  try {
    const alumni = await prisma.alumni.findMany({
      select: { name: true, conseil: true },
    });
    res.json(alumni);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

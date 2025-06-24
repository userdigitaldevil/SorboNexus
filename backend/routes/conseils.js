const express = require("express");
const Alumni = require("../models/Alumni");
const router = express.Router();

// GET /api/conseils - return all conseils from alumni
router.get("/", async (req, res) => {
  try {
    const alumni = await Alumni.find();
    const conseils = alumni.map((a) => ({
      name: a.name,
      conseil: a.conseil,
    }));
    res.json(conseils);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

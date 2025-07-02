const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// GET /api/links - get all links
router.get("/", async (req, res) => {
  try {
    const links = await prisma.link.findMany({
      orderBy: { id: "desc" }, // Optional: newest first
    });
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch links" });
  }
});

// DELETE /api/links/:id - delete a link by id
router.delete("/:id", async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    await prisma.link.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete link" });
  }
});

module.exports = router;

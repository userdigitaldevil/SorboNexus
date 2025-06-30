const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isAdmin, isAuthenticated } = require("../middleware/auth");

// GET /api/annonces?skip=0&take=3 (default: 3 per page, newest first)
router.get("/", async (req, res) => {
  try {
    const take = parseInt(req.query.take) || 3;
    const skip = parseInt(req.query.skip) || 0;
    const annonces = await prisma.annonce.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      skip,
      take,
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            isAdmin: true,
            alumni: { select: { name: true, avatar: true } },
          },
        },
      },
    });
    const total = await prisma.annonce.count({ where: { deletedAt: null } });
    res.json({ annonces, total });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des annonces." });
  }
});

// POST /api/annonces (admin only)
router.post("/", isAdmin, async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Titre et contenu requis." });
    }
    const annonce = await prisma.annonce.create({
      data: {
        title,
        content,
        createdBy: { connect: { id: req.user.id } },
      },
      include: {
        createdBy: {
          select: {
            id: true,
            username: true,
            isAdmin: true,
            alumni: { select: { name: true, avatar: true } },
          },
        },
      },
    });
    res.status(201).json(annonce);
  } catch (err) {
    res.status(500).json({ error: "Erreur lors de la création de l'annonce." });
  }
});

// DELETE /api/annonces/:id (admin only, soft delete)
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const annonce = await prisma.annonce.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    res.json({ success: true });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de l'annonce." });
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { isAuthenticated } = require("../middleware/auth");

// Add a mapping for category gradients
const categoryGradients = {
  Université: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
  Bibliothèques: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
  Services: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  Carrière: "linear-gradient(135deg, #ef4444 0%, #ec4899 100%)",
  Outils: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
};

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

// POST /api/links - create a new link (authenticated users only)
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const { title, url, description, category, icon } = req.body;
    // Remove 'gradient' from required fields check
    if (!title || !url || !description || !category || !icon) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }
    const createdById = req.user.id;
    // Assign gradient based on category
    const gradient =
      categoryGradients[category] ||
      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)";
    const newLink = await prisma.link.create({
      data: {
        title,
        url,
        description,
        category,
        icon,
        gradient,
        createdById,
      },
    });
    res.status(201).json(newLink);
  } catch (err) {
    console.error("Error creating link:", err);
    res.status(500).json({ error: "Erreur lors de l'ajout du lien." });
  }
});

// PUT /api/links/:id - update a link (authenticated users only, but only creator or admin)
router.put("/:id", isAuthenticated, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    const { title, url, description, category, icon } = req.body;
    if (!title || !url || !description || !category || !icon) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }
    // Fetch the link to check permissions
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link) {
      return res.status(404).json({ error: "Lien non trouvé." });
    }
    // Only allow if admin or creator
    if (!req.user.isAdmin && link.createdById !== req.user.id) {
      return res.status(403).json({ error: "Accès refusé." });
    }
    // Assign gradient based on category
    const gradient =
      categoryGradients[category] ||
      "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)";
    const updatedLink = await prisma.link.update({
      where: { id },
      data: {
        title,
        url,
        description,
        category,
        icon,
        gradient,
      },
    });
    res.json(updatedLink);
  } catch (err) {
    console.error("Error updating link:", err);
    res.status(500).json({ error: "Erreur lors de la modification du lien." });
  }
});

// DELETE /api/links/:id - delete a link by id (only creator or admin)
router.delete("/:id", isAuthenticated, async (req, res) => {
  const id = parseInt(req.params.id, 10);
  try {
    // Fetch the link to check permissions
    const link = await prisma.link.findUnique({ where: { id } });
    if (!link) {
      return res.status(404).json({ error: "Lien non trouvé." });
    }
    // Only allow if admin or creator
    if (!req.user.isAdmin && link.createdById !== req.user.id) {
      return res.status(403).json({ error: "Accès refusé." });
    }
    // Delete all bookmarks for this link
    await prisma.bookmark.deleteMany({
      where: { itemId: id, itemType: "link" },
    });
    // Delete the link
    await prisma.link.delete({ where: { id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete link" });
  }
});

module.exports = router;

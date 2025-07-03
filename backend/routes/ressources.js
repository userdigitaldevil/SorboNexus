const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { isAdmin, isAuthenticated } = require("../middleware/auth");

// Set up multer for file uploads
const uploadDir = path.join(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});
const upload = multer({ storage });

// GET /api/ressources - get all resources
router.get("/", async (req, res) => {
  try {
    const ressources = await prisma.ressource.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.json(ressources);
  } catch (err) {
    console.error("Error fetching ressources:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des ressources." });
  }
});

// POST /api/upload - handle file upload
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ url: fileUrl });
});

// POST /api/ressources - create a new resource (any authenticated user)
router.post("/", isAuthenticated, async (req, res) => {
  try {
    const {
      title,
      subject,
      description,
      icon,
      type,
      category,
      filter,
      resourceUrl,
      format,
    } = req.body;
    if (!title || !type || !category || !filter || !format) {
      return res.status(400).json({ error: "Champs obligatoires manquants." });
    }
    if (type !== "Text" && !resourceUrl) {
      return res.status(400).json({
        error: "Le fichier ou l'URL est requis pour ce type de ressource.",
      });
    }
    if (type === "Text" && !description) {
      return res.status(400).json({
        error: "La description est requise pour une ressource de type texte.",
      });
    }
    const createdById = req.user.id;
    // Ensure category is always an array
    const categoryArray = Array.isArray(category)
      ? category
      : typeof category === "string" && category.length > 0
      ? category.split(",").map((c) => c.trim())
      : [];
    const newResource = await prisma.ressource.create({
      data: {
        title,
        subject,
        description,
        icon,
        type,
        category: categoryArray,
        filter,
        resourceUrl,
        format,
        createdById,
        gradient: "",
      },
    });
    res.status(201).json(newResource);
  } catch (err) {
    console.error("Error creating resource:", err);
    res.status(500).json({ error: "Erreur lors de l'ajout de la ressource." });
  }
});

// PUT /api/ressources/:id - update a resource (admin or creator only)
router.put("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await prisma.ressource.findUnique({
      where: { id: Number(id) },
    });
    if (!resource)
      return res.status(404).json({ error: "Ressource non trouvée." });
    if (!req.user.isAdmin && resource.createdById !== req.user.id) {
      return res.status(403).json({ error: "Accès refusé." });
    }
    const {
      title,
      subject,
      description,
      icon,
      type,
      category,
      filter,
      resourceUrl,
      format,
    } = req.body;
    // Ensure category is always an array
    const categoryArray = Array.isArray(category)
      ? category
      : typeof category === "string" && category.length > 0
      ? category.split(",").map((c) => c.trim())
      : [];
    const updated = await prisma.ressource.update({
      where: { id: Number(id) },
      data: {
        title,
        subject,
        description,
        icon,
        type,
        category: categoryArray,
        filter,
        resourceUrl,
        format,
        gradient: "", // or keep previous if you want
      },
    });
    res.json(updated);
  } catch (err) {
    console.error("Error updating resource:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la modification de la ressource." });
  }
});

// DELETE /api/ressources/:id - delete a resource (admin or creator only)
router.delete("/:id", isAuthenticated, async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await prisma.ressource.findUnique({
      where: { id: Number(id) },
    });
    if (!resource)
      return res.status(404).json({ error: "Ressource non trouvée." });
    if (!req.user.isAdmin && resource.createdById !== req.user.id) {
      return res.status(403).json({ error: "Accès refusé." });
    }
    await prisma.ressource.delete({ where: { id: Number(id) } });
    res.json({ success: true });
  } catch (err) {
    console.error("Error deleting resource:", err);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression de la ressource." });
  }
});

module.exports = router;

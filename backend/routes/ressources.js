const express = require("express");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { isAdmin, isAuthenticated } = require("../middleware/auth");
const { sanitizeInput, sanitizeContent } = require("../middleware/sanitize");

// Cloudflare R2 config for file deletion
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.R2_BUCKET_NAME || "sorbonexus";

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

// (Upload endpoint will be handled in upload.js)

// POST /api/ressources - create a new resource (any authenticated user)
router.post("/", isAuthenticated, sanitizeContent, async (req, res) => {
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
router.put(
  "/:id",
  isAuthenticated,
  sanitizeInput,
  sanitizeContent,
  async (req, res) => {
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
  }
);

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

    // --- File cleanup logic ---
    // Handle R2 file deletion (both custom domain and direct R2 URLs)
    if (
      resource.resourceUrl &&
      (resource.resourceUrl.includes("r2.cloudflarestorage.com") ||
        resource.resourceUrl.includes("ressources.sorbonexus.com"))
    ) {
      try {
        // Extract the file key from the R2 URL
        const urlParts = resource.resourceUrl.split("/");
        const fileKey = urlParts[urlParts.length - 1];

        const command = new DeleteObjectCommand({
          Bucket: BUCKET,
          Key: fileKey,
        });
        await s3.send(command);
        console.log(`Successfully deleted R2 file: ${fileKey}`);
      } catch (err) {
        console.error("Failed to delete R2 file:", err);
        // Continue with resource deletion even if file deletion fails
      }
    }
    // Handle local file deletion (for backward compatibility)
    else if (
      resource.resourceUrl &&
      resource.resourceUrl.startsWith("/api/files/")
    ) {
      const filename = resource.resourceUrl.replace("/api/files/", "");
      const uploadsDir = path.join(__dirname, "../uploads");
      const filePath = path.join(uploadsDir, filename);
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error("Failed to delete local file:", filePath, err);
        }
      }
    }
    // --- End file cleanup ---

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

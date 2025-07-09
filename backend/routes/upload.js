const express = require("express");
const router = express.Router();
const multer = require("multer");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const path = require("path");
const fs = require("fs");
const { isAuthenticated } = require("../middleware/auth");

// Cloudflare R2 config
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});
const BUCKET = process.env.R2_BUCKET_NAME || "sorbonexus"; // Add fallback

// Set up multer for file uploads (memory storage)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ["application/pdf", "image/png", "image/jpeg"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else
      cb(
        new Error("Invalid file type. Only PDF, PNG, and JPEG allowed."),
        false
      );
  },
});

// POST / - handle file upload
router.post("/", isAuthenticated, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  try {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    const key = uniqueSuffix + "-" + safeName;
    const command = new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    });
    await s3.send(command);
    // Construct the public URL using custom domain if set, otherwise fallback to R2 public domain
    const fileUrl = `${
      process.env.R2_CUSTOM_DOMAIN ||
      "https://pub-27cbf0014974897ee67bafdcddf782da.r2.dev"
    }/${key}`;
    res.json({
      filename: key,
      originalName: req.file.originalname,
      url: fileUrl,
    });
  } catch (err) {
    console.error("R2 upload error:", err);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;

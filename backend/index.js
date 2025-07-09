console.log("=== THIS IS THE RUNNING BACKEND ===");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");
const fs = require("fs");

const app = express();

// Enhanced security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:", "blob:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'"],
        frameSrc: ["'none'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate limiting for authentication routes only
const authLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // limit each IP to 5 requests per minute
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? [
          "https://sorbonexus.com",
          "https://www.sorbonexus.com",
          "https://sorbonexus-frontend.onrender.com",
          "https://sorbonexus-backend.onrender.com",
          "https://sorbonexus-frontend-production-7763.up.railway.app",
        ]
      : [
          "http://localhost:5173",
          "http://localhost:5174",
          "http://localhost:5175",
          "http://localhost:5176",
        ],
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};
app.use(cors(corsOptions));

// Body parsing with size limits
app.use(express.json({ limit: "10mb" })); // Limit payload size
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Additional security headers
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader(
    "Permissions-Policy",
    "geolocation=(), microphone=(), camera=()"
  );
  next();
});

app.get("/", (req, res) => res.send("API running!"));

// Apply auth rate limiting to auth routes
app.use("/api/auth", authLimiter, require("./routes/auth"));
app.use("/api/alumni", require("./routes/alumni"));
app.use("/api/conseils", require("./routes/conseils"));
app.use("/api/annonces", require("./routes/annonces"));
app.use("/api/links", require("./routes/links"));
const ressourcesRouter = require("./routes/ressources");
const uploadRouter = require("./routes/upload");
app.use("/api/ressources", ressourcesRouter);
app.use("/api/upload", uploadRouter);
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Serve uploaded files from backend/uploads with security
const uploadsDir = path.join(__dirname, "uploads");
console.log("[DEBUG] Uploads directory (absolute path):", uploadsDir);
app.get("/api/files/:filename", (req, res) => {
  const filename = req.params.filename;

  // Security: Prevent directory traversal attacks
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return res.status(400).json({ error: "Invalid filename" });
  }

  // Security: Only allow specific file extensions
  const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".gif"];
  const fileExtension = path.extname(filename).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    return res.status(400).json({ error: "File type not allowed" });
  }

  const filePath = path.join(uploadsDir, filename);
  console.log(`[DEBUG] Attempting to serve file: ${filePath}`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    console.log(`[DEBUG] File not found: ${filePath}`);
    res.status(404).json({ error: "File not found" });
  }
});

app.get("/api/test", (req, res) => res.send("API root test working!"));

app.get("/api/links-direct", (req, res) => res.json({ direct: true }));

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

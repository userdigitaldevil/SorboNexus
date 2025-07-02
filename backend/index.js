console.log("=== THIS IS THE RUNNING BACKEND ===");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const path = require("path");

const app = express();

// Security middleware
app.use(helmet());

// Commented out rate limiter for testing
// app.use(rateLimit({ windowMs: 60 * 1000, max: 5 }));

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
};
app.use(cors(corsOptions));

app.use(express.json({ limit: "10mb" })); // Limit payload size

app.get("/", (req, res) => res.send("API running!"));

// Apply auth rate limiting to auth routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/alumni", require("./routes/alumni"));
app.use("/api/conseils", require("./routes/conseils"));
app.use("/api/annonces", require("./routes/annonces"));
app.use("/api/links", require("./routes/links"));
const ressourcesRouter = require("./routes/ressources");
const uploadRouter = require("./routes/upload");
app.use("/api/ressources", ressourcesRouter);
app.use("/api/upload", uploadRouter);
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.get("/api/test", (req, res) => res.send("API root test working!"));

app.get("/api/links-direct", (req, res) => res.json({ direct: true }));

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Add global error handlers for debugging
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});

// Keep-alive interval for debugging
setInterval(() => {}, 1000 * 60 * 60);

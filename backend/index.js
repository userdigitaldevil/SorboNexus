console.log("=== THIS IS THE RUNNING BACKEND ===");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
// const rateLimit = require("express-rate-limit");
require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

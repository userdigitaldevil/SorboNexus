const express = require("express");
const { PrismaClient } = require("@prisma/client");
const router = express.Router();
const prisma = new PrismaClient();

// Middleware to get user ID from JWT token
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    // Decode JWT to get user ID (assuming you have a similar auth system)
    const jwt = require("jsonwebtoken");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Use the User ID, not the Alumni ID

    console.log("JWT decoded:", decoded);
    console.log("Extracted userId:", req.userId);

    if (!req.userId) {
      return res.status(401).json({ error: "Invalid token" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

// POST /api/bookmarks - Add a bookmark
router.post("/", authenticateUser, async (req, res) => {
  try {
    const { itemId, itemType } = req.body;
    const userId = req.userId;

    console.log("Bookmark request:", { itemId, itemType, userId });

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("User not found:", userId);
      return res.status(404).json({ error: "User not found" });
    }

    // Validate itemType
    const validTypes = ["alumni", "ressource", "link"];
    if (!validTypes.includes(itemType)) {
      return res.status(400).json({
        error: "Invalid itemType. Must be: alumni, ressource, or link",
      });
    }

    // Check if item exists based on type
    let itemExists = false;
    const numericItemId = parseInt(itemId);
    switch (itemType) {
      case "alumni":
        itemExists = await prisma.alumni.findUnique({
          where: { id: numericItemId },
        });
        break;
      case "ressource":
        itemExists = await prisma.ressource.findUnique({
          where: { id: numericItemId },
        });
        break;
      case "link":
        itemExists = await prisma.link.findUnique({
          where: { id: numericItemId },
        });
        break;
    }

    if (!itemExists) {
      return res.status(404).json({ error: `${itemType} not found` });
    }

    // Check if bookmark already exists
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_itemId_itemType: {
          userId,
          itemId: numericItemId,
          itemType,
        },
      },
    });

    if (existingBookmark) {
      return res.status(409).json({ error: "Bookmark already exists" });
    }

    // Create bookmark
    const bookmark = await prisma.bookmark.create({
      data: {
        userId,
        itemId: parseInt(itemId),
        itemType,
      },
    });

    // Increment bookmark count on the item (without updating updatedAt)
    switch (itemType) {
      case "alumni":
        await prisma.$executeRaw`UPDATE "Alumni" SET "bookmarkCount" = "bookmarkCount" + 1 WHERE id = ${numericItemId}`;
        break;
      case "ressource":
        await prisma.$executeRaw`UPDATE "Ressource" SET "bookmarkCount" = "bookmarkCount" + 1 WHERE id = ${numericItemId}`;
        break;
      case "link":
        await prisma.link.updateMany({
          where: { id: numericItemId },
          data: { bookmarkCount: { increment: 1 } },
        });
        break;
    }

    res.status(201).json({ message: "Bookmark added successfully", bookmark });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      itemId,
      itemType,
      userId,
    });
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/bookmarks/:itemId - Remove a bookmark
router.delete("/:itemId", authenticateUser, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { itemType } = req.query;
    const userId = req.userId;

    // Validate itemType
    const validTypes = ["alumni", "ressource", "link"];
    if (!validTypes.includes(itemType)) {
      return res.status(400).json({
        error: "Invalid itemType. Must be: alumni, ressource, or link",
      });
    }

    // Find and delete bookmark
    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_itemId_itemType: {
          userId,
          itemId: parseInt(itemId),
          itemType,
        },
      },
    });

    if (!bookmark) {
      return res.status(404).json({ error: "Bookmark not found" });
    }

    await prisma.bookmark.delete({
      where: {
        userId_itemId_itemType: {
          userId,
          itemId: parseInt(itemId),
          itemType,
        },
      },
    });

    // Decrement bookmark count on the item (without updating updatedAt)
    switch (itemType) {
      case "alumni":
        await prisma.$executeRaw`UPDATE "Alumni" SET "bookmarkCount" = "bookmarkCount" - 1 WHERE id = ${parseInt(
          itemId
        )}`;
        break;
      case "ressource":
        await prisma.$executeRaw`UPDATE "Ressource" SET "bookmarkCount" = "bookmarkCount" - 1 WHERE id = ${parseInt(
          itemId
        )}`;
        break;
      case "link":
        await prisma.link.updateMany({
          where: { id: parseInt(itemId) },
          data: { bookmarkCount: { decrement: 1 } },
        });
        break;
    }

    res.json({ message: "Bookmark removed successfully" });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/bookmarks/user/:userId - Get user's bookmarks
router.get("/user/:userId", authenticateUser, async (req, res) => {
  try {
    const { userId } = req.params;
    const { itemType } = req.query;

    // Validate that user can only access their own bookmarks
    if (parseInt(userId) !== req.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const whereClause = { userId: parseInt(userId) };
    if (itemType) {
      whereClause.itemType = itemType;
    }

    const bookmarks = await prisma.bookmark.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    res.json(bookmarks);
  } catch (error) {
    console.error("Error fetching user bookmarks:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/bookmarks/count/:itemId - Get bookmark count for an item
router.get("/count/:itemId", async (req, res) => {
  try {
    const { itemId } = req.params;
    const { itemType } = req.query;

    // Validate itemType
    const validTypes = ["alumni", "ressource", "link"];
    if (!validTypes.includes(itemType)) {
      return res.status(400).json({
        error: "Invalid itemType. Must be: alumni, ressource, or link",
      });
    }

    const count = await prisma.bookmark.count({
      where: {
        itemId: parseInt(itemId),
        itemType,
      },
    });

    res.json({ count });
  } catch (error) {
    console.error("Error fetching bookmark count:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/bookmarks/check/:itemId - Check if user has bookmarked an item
router.get("/check/:itemId", authenticateUser, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { itemType } = req.query;
    const userId = req.userId;

    // Validate itemType
    const validTypes = ["alumni", "ressource", "link"];
    if (!validTypes.includes(itemType)) {
      return res.status(400).json({
        error: "Invalid itemType. Must be: alumni, ressource, or link",
      });
    }

    const bookmark = await prisma.bookmark.findUnique({
      where: {
        userId_itemId_itemType: {
          userId,
          itemId: parseInt(itemId),
          itemType,
        },
      },
    });

    res.json({ isBookmarked: !!bookmark });
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;

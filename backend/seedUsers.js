const mongoose = require("mongoose");
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const User = require("./models/User");
const Alumni = require("./models/Alumni");

dotenv.config({ path: __dirname + "/.env" });

// Helper to normalize names (remove accents, lowercase, remove spaces)
function normalize(str) {
  return str
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/\s+/g, "")
    .toLowerCase();
}

async function seedUsers() {
  await mongoose.connect(process.env.MONGO_URI);

  const usersData = JSON.parse(
    fs.readFileSync(__dirname + "/alumniUsers.json", "utf-8")
  );

  // Remove old users (optional)
  await User.deleteMany({});

  for (const user of usersData) {
    // Find alumni by normalized name
    const alumni = await Alumni.findOne({
      $expr: {
        $eq: [
          {
            $toLower: {
              $replaceAll: {
                input: {
                  $replaceAll: { input: "$name", find: " ", replacement: "" },
                },
                find: "é",
                replacement: "e",
              },
            },
          },
          normalize(user.username),
        ],
      },
    });
    const hash = await bcrypt.hash(user.password, 10);
    await User.create({
      username: user.username,
      password: hash,
      isAdmin: user.username === "admindigitaldevil",
      alumni: alumni ? alumni._id : undefined,
    });
  }

  console.log("Users seeded and linked to alumni!");
  process.exit();
}

seedUsers().catch((err) => {
  console.error(err);
  process.exit(1);
});

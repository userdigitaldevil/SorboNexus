const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Alumni = require("./models/Alumni");
const fs = require("fs");

dotenv.config({ path: __dirname + "/.env" });

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);

  // Read alumni data from JSON file
  const alumniData = JSON.parse(
    fs.readFileSync(__dirname + "/alumniSeed.json", "utf-8")
  );

  // Remove old alumni (optional)
  await Alumni.deleteMany({});

  // Insert new alumni
  await Alumni.insertMany(alumniData);

  console.log("Alumni data seeded!");
  process.exit();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

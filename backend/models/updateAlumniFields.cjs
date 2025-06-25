require("dotenv").config();
const mongoose = require("mongoose");
const Alumni = require("./backend/models/Alumni");

async function updateAllAlumni() {
  await mongoose.connect(process.env.MONGO_URI);
  // Only set createdAt if it doesn't exist
  const now = new Date();
  await Alumni.updateMany(
    { nationalities: { $exists: false } },
    { $set: { nationalities: [] } }
  );
  await Alumni.updateMany(
    { stagesWorkedContestsExtracurriculars: { $exists: false } },
    { $set: { stagesWorkedContestsExtracurriculars: "" } }
  );
  await Alumni.updateMany(
    { createdAt: { $exists: false } },
    { $set: { createdAt: now } }
  );
  console.log("All alumni updated with new fields!");
  process.exit();
}

updateAllAlumni();

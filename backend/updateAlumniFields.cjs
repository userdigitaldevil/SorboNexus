require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const Alumni = require("./models/Alumni");
const moment = require("moment-timezone");

async function updateAllAlumni() {
  await mongoose.connect(process.env.MONGO_URI);
  // Only set accountCreationDate if it doesn't exist
  const nowParis = moment().tz("Europe/Paris").toDate();
  await Alumni.updateMany(
    { nationalities: { $exists: false } },
    { $set: { nationalities: [] } }
  );
  await Alumni.updateMany(
    { stagesWorkedContestsExtracurriculars: { $exists: false } },
    { $set: { stagesWorkedContestsExtracurriculars: "" } }
  );
  await Alumni.updateMany(
    { accountCreationDate: { $exists: false } },
    { $set: { accountCreationDate: nowParis } }
  );
  // Optionally remove createdAt from old docs
  await Alumni.updateMany(
    { createdAt: { $exists: true } },
    { $unset: { createdAt: "" } }
  );
  console.log("All alumni updated with new fields!");
  process.exit();
}

updateAllAlumni();

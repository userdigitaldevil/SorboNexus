const mongoose = require("mongoose");
const moment = require("moment-timezone");

const AlumniSchema = new mongoose.Schema({
  name: String,
  degree: String,
  position: String,
  field: String,
  gradient: String,
  color: String,
  linkedin: String,
  email: String,
  avatar: String,
  isAdmin: Boolean,
  profile: {
    email: String,
    linkedin: String,
    grades: Object,
    currentPosition: String,
    schoolsApplied: [
      {
        name: String,
        status: String,
      },
    ],
  },
  conseil: String,
  hidden: { type: Boolean, default: false },
  nationalities: [String],
  stagesWorkedContestsExtracurriculars: String,
  accountCreationDate: {
    type: Date,
    default: () => moment().tz("Europe/Paris").toDate(),
    required: true,
  },
});

module.exports = mongoose.model("Alumni", AlumniSchema);

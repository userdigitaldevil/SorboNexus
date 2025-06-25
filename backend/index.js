console.log("=== THIS IS THE RUNNING BACKEND ===");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API running!"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/alumni", require("./routes/alumni"));
app.use("/api/conseils", require("./routes/conseils"));

console.log("MONGO_URI:", process.env.MONGO_URI);

const PORT = process.env.PORT || 5001;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("MongoDB error:", err));

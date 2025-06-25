console.log("=== THIS IS THE RUNNING BACKEND ===");
const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API running!"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/alumni", require("./routes/alumni"));
app.use("/api/conseils", require("./routes/conseils"));

console.log("MONGO_URI:", process.env.MONGO_URI);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(5001, () => console.log("Server running on port 5001"));
  })
  .catch((err) => console.error("MongoDB error:", err));

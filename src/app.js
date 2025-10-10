const express = require("express");
const path = require("path");
const mathRoutes = require("./routes/mathRoutes");

const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
app.use("/api", mathRoutes);

module.exports = app;

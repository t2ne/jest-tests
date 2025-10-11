const express = require("express");
const path = require("path");

const app = express();

// Hide Express from headers for security
app.disable("x-powered-by");

app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));
// API routes removed: using frontend-only exercises playground

module.exports = app;

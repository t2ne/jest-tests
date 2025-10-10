const express = require("express");
const router = express.Router();
const { add, subtract } = require("../math");

// GET /api/add?a=1&b=2
router.get("/add", (req, res) => {
  const { a, b } = req.query;
  try {
    const result = add(Number(a), Number(b));
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// GET /api/subtract?a=5&b=2
router.get("/subtract", (req, res) => {
  const { a, b } = req.query;
  try {
    const result = subtract(Number(a), Number(b));
    res.json({ result });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

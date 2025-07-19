const express = require("express");
const router = express.Router();
const Shape = require("../models/Shape");

// GET /api/shapes - return all shapes
router.get("/", async (req, res) => {
  try {
    const shapes = await Shape.find();
    res.json(shapes);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch shapes" });
  }
});

module.exports = router;

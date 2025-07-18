const express = require("express");
const router = express.Router();
const FavoriteShapeCombo = require("../models/FavoriteShapeCombo");

// Save a favorite combo
router.post("/", async (req, res) => {
  try {
    const { user, startShapeName, endShapeName, startShapePath, endShapePath } = req.body;
    const combo = new FavoriteShapeCombo({ user, startShapeName, endShapeName, startShapePath, endShapePath });
    await combo.save();
    res.status(201).json(combo);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all favorites for a user
router.get("/:userId", async (req, res) => {
  try {
    const combos = await FavoriteShapeCombo.find({ user: req.params.userId });
    res.json(combos);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

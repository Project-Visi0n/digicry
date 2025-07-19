
const express = require("express");
const router = express.Router();
const FavoriteShapeCombo = require("../models/FavoriteShapeCombo");

// Update a favorite combo by ID
router.patch("/:id", async (req, res) => {
  try {
    const updates = {};
    if (req.body.startPath || req.body.startShapePath) {
      updates.startShapePath = req.body.startShapePath || req.body.startPath;
    }
    if (req.body.endPath || req.body.endShapePath) {
      updates.endShapePath = req.body.endShapePath || req.body.endPath;
    }
    if (req.body.startShapeName) {
      updates.startShapeName = req.body.startShapeName;
    }
    if (req.body.endShapeName) {
      updates.endShapeName = req.body.endShapeName;
    }
    const updated = await FavoriteShapeCombo.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Save a favorite combo
router.post("/", async (req, res) => {
  try {
    const { user, startShapeName, endShapeName, startPath, endPath } = req.body;
    // Accept either the old or new field names for compatibility
    const combo = new FavoriteShapeCombo({
      user,
      startShapeName,
      endShapeName,
      startShapePath: req.body.startShapePath || startPath,
      endShapePath: req.body.endShapePath || endPath,
    });
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


// Delete a favorite combo by ID
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await FavoriteShapeCombo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Favorite not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

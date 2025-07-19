const express = require("express");
const router = express.Router();
const FavoriteShapeCombo = require("../models/FavoriteShapeCombo");

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
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await FavoriteShapeCombo.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Favorite not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

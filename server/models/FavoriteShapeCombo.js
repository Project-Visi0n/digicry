const mongoose = require("mongoose");

const FavoriteShapeComboSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  startShapeName: { type: String, required: false },
  endShapeName: { type: String, required: false },
  startShapePath: { type: String, required: true },
  endShapePath: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FavoriteShapeCombo", FavoriteShapeComboSchema);

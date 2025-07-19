const mongoose = require("mongoose");

const ShapeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
});

module.exports = mongoose.model("Shape", ShapeSchema);

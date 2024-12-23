const mongoose = require("mongoose");

const { Schema } = mongoose;

const journalSchema = new Schema(
  {
    title: String,
    content: String,
    mood: String,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

const Journal = mongoose.model("Journal", journalSchema);

module.exports = Journal;

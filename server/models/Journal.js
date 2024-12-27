const mongoose = require("mongoose");

const { Schema } = mongoose;

const journalEntrySchema = new Schema(
  {
    // Currently required to associate journal entries with users. Since authentication isn’t set up yet, we need to provide a valid userId when creating entries. Later, this will be automatically set based on the authenticated user.
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [100, "Title cannot be more than 100 characters"]
    },
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
    },
    mood: {
      type: String,
      required: [true, "Mood is required"],
      enum: ["😊", "😐", "😢", "😡", "😴"],
    },
  },
  {
    timestamps: true,
  },
);

const Journal = mongoose.model("Journal", journalEntrySchema);

module.exports = Journal;

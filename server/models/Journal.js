const mongoose = require("mongoose");

const { Schema } = mongoose;

const journalEntrySchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxLength: [100, "Title cannot be more than 100 characters"],
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
    normalizedSentiment: {
      type: Number,
    },
    sentimentScore: {
      type: Number,
      default: 0,
    },
    sentimentMagnitude: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const Journal = mongoose.model("Journal", journalEntrySchema);

module.exports = Journal;

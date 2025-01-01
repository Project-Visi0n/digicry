const mongoose = require("mongoose");

const { Schema } = mongoose;

const forumsSchema = new Schema(
  {
    forumName: { type: String, required: true },
    user: String,
    message: String,
    upVote: Number,
    downVote: Number,
  },
  { timestamps: true } // Every postSchema will now have a createdAt && updatedAt value
);


const Forums = mongoose.model("Forums", forumsSchema);


module.exports = Forums;

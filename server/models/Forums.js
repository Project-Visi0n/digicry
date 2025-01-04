const mongoose = require("mongoose");


const { Schema } = mongoose;

const forumsSchema = new Schema(
  {
    forumName: { type: String, required: true },
    user: String,
    message: String,
    upVote: Number,
    downVote: Number,
    expireAt: Date
  },
  { timestamps: true } // Every postSchema will now have a createdAt && updatedAt value
);

// Sets expiration date for posts
forumsSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

const Forums = mongoose.model("Forums", forumsSchema);


module.exports = Forums;

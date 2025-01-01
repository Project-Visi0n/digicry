const mongoose = require("mongoose");

const { Schema } = mongoose;

const postSchema = new Schema(
  {
    forum: { type: String, required: true },
    user: String,
    message: String,
    upVote: Number,
    downVote: Number,
  },
  { timestamps: true } // Every postSchema will now have a createdAt && updatedAt value
);


const Posts = mongoose.model("Posts", postSchema);


module.exports = Posts;

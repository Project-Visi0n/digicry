const mongoose = require("mongoose");

const { Schema } = mongoose;

const usersSchema = new Schema({
  username: String,
  hashed_password: String,
  salt: String,
  name: String,
  location: String,
});

const User = mongoose.model("User", usersSchema);

module.exports = User;

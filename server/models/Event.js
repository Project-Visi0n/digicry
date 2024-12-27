const mongoose = require("mongoose");

const { Schema } = mongoose;

const eventSchema = new Schema({
  title: String,
  date: String,
  location: Array,
  description: String,
  venueName: String,
  linkUrl: String,
  ticketUrl: String,
  thumbnail: String,
  image: String,
});

const Event = mongoose.model("Event", eventSchema);
module.exports = Event;

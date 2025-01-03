const mongoose = require("mongoose");
const { Journal, User } = require("../models");
const connectDB = require("./index");

// Connect to MongoDB
connectDB();

const olderEntries = [
  {
    // an existing user
    userId: "643fba3a106ec4144c028f27",
    title: "My day at the park",
    content: "It was a sunny day and I felt so relaxed and happy.",
    mood: "😊",
    createdAt: new Date("2023-01-10"),
  },
  {
    userId: "643fba3a106ec4144c028f27",
    title: "A tough evening",
    content: "Everything felt overwhelming and stressful last night.",
    mood: "😡",
    createdAt: new Date("2023-01-12"),
  },
];

Journal.insertMany(olderEntries)
  .then(() => {
    console.log("Successfully seeded older entries");
  })
  .catch((err) => console.error(err))
  .finally(() => mongoose.connection.close());

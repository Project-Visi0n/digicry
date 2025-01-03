const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { Journal } = require("../models");
const connectDB = require("./index");

dotenv.config();

// Connect to MongoDB
connectDB();

const olderEntries = [
  {
    // an existing user
    userId: "643fba3a106ec4144c028f27",
    title: "My day at the park",
    content: "It was a sunny day and I felt so relaxed and happy.",
    mood: "😊",
    sentimentScore: 78,
    createdAt: new Date("2023-01-10"),
  },
  {
    userId: "643fba3a106ec4144c028f27",
    title: "A tough evening",
    content: "Everything felt overwhelming and stressful last night.",
    mood: "😡",
    sentimentScore: 50,
    createdAt: new Date("2023-01-12"),
  },
  {
    userId: "643fba3a106ec4144c028f27",
    title: "Rainy Afternoon Blues",
    content:
      "The constant rain made me feel a bit gloomy. I stayed in all day.",
    mood: "😢",
    sentimentScore: 60,
    createdAt: new Date("2023-02-03"),
  },
  {
    userId: "643fba3a106ec4144c028f27",
    title: "Gym Motivation",
    content:
      "Went to the gym and felt an incredible rush of energy afterwards!",
    mood: "😊",
    sentimentScore: 85,
    createdAt: new Date("2023-02-08"),
  },
  {
    userId: "643fba3a106ec4144c028f27",
    title: "Long Commute Frustrations",
    content:
      "Traffic was awful. I was late to work and felt angry at the delay.",
    mood: "😡",
    sentimentScore: 40,
    createdAt: new Date("2023-02-14"),
  },
  {
    userId: "643fba3a106ec4144c028f27",
    title: "Peaceful Morning",
    content: "Woke up early, had a nice coffee, and read a book quietly.",
    mood: "😊",
    sentimentScore: 70,
    createdAt: new Date("2023-02-18"),
  },
  {
    userId: "643fba3a106ec4144c028f27",
    title: "Overworked",
    content: "Stayed at the office way too late. Feeling totally drained.",
    mood: "😴",
    sentimentScore: 60,
    createdAt: new Date("2023-02-20"),
  },
  {
    userId: "643fba3a106ec4144c028f27",
    title: "Family Visit",
    content: "My parents visited. We had laughs and great food!",
    mood: "😊",
    sentimentScore: 80,
    createdAt: new Date("2023-03-01"),
  },
  {
    userId: "643fba3a106ec4144c028f27",
    title: "Creative Spark",
    content: "Wrote some code and felt so inspired today!",
    mood: "😊",
    sentimentScore: 80,
    createdAt: new Date("2023-03-05"),
  },
  {
    userId: "643fba3a106ec4144c028f27",
    title: "Night of Regret",
    content: "Had an argument with a friend. Now I feel guilty and sad.",
    mood: "😢",
    sentimentScore: 50,
    createdAt: new Date("2023-03-07"),
  },
];

// Remove older entries from that user to avoid duplicates
function clearOldEntries() {
  // Remove all
  return Journal.deleteMany(olderEntries);
}

// Insert olderEntries
async function seedEntries() {
  try {
    await clearOldEntries(); // remove them first
    await Journal.insertMany(olderEntries);
    console.log("Successfully seeded older entries");
  } catch (err) {
    console.error("Seeding error:", err);
  } finally {
    mongoose.connection.close();
  }
}

// Run the seed function
seedEntries();

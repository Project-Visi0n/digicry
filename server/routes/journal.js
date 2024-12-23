/* eslint-disable consistent-return */
const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const { Journal, User } = require("../models");

// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Create new journal entry
router.post("/", (req, res) => {
  const { userId, title, content, mood } = req.body;

  // Validate required fields
  if (!userId || !isValidObjectId(userId)) {
    return res.sendStatus(400);
  }

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.sendStatus(400);
  }

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.sendStatus(400);
  }

  if (!mood || !["😊", "😐", "😢", "😡", "😴"].includes(mood)) {
    return res.sendStatus(400);
  }

  // Check if user exists
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new Error("User not found.");
      }

      // Create new journal entry
      const newEntry = new Journal({
        userId,
        title: title.trim(),
        content: content.trim(),
        mood,
      });

      return newEntry.save();
    })
    .then((savedEntry) => {
      res.status(201).send(savedEntry);
    })
    .catch((err) => {
      console.error("Error creating journal entry:", err.message);
      res.sendStatus(500);
    });
});

// Retrieve all journal entries
router.get("/", (req, res) => {
  const { userId } = req.query;

  const filter = {};

  if (userId) {
    if (!isValidObjectId(userId)) {
      return res.sendStatus(400);
    }
    filter.userId = userId;
  }

  Journal.find(filter)
    .sort({ createdAt: -1 }) // Newest first
    .then((entries) => {
      res.send(entries);
    })
    .catch((err) => {
      console.error("Error fetching journal entries:", err.message);
      res.sendStatus(500);
    });
});








module.exports = router;
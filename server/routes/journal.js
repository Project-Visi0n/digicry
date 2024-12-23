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

// Update an existing journal entry
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { userId, title, content, mood } = req.body;

  if (!isValidObjectId(id)) {
    return res.sendStatus(400);
  }

  // Build the update object
  const update = {};
  if (title && typeof title === "string" && title.trim() !== "") {
    update.title = title.trim();
  }
  if (content && typeof content === "string" && content.trim() !== "") {
    update.content = content.trim();
  }
  if (mood && ["😊", "😐", "😢", "😡", "😴"].includes(mood)) {
    update.mood = mood;
  }

  if (Object.keys(update).length === 0) {
    return res.sendStatus(400);
  }

  // If userId is provided in update, validate it
  if (userId && !isValidObjectId(userId)) {
    return res.sendStatus(400);
  }

  // Ensure that the userId in the update matches the existing entry's userId
  Journal.findById(id)
    .then((entry) => {
      if (!entry) {
        throw new Error("Journal entry not found.");
      }

      if (userId && entry.userId.toString() !== userId) {
        throw new Error("Cannot change the userId of the journal entry.");
      }

      // Update the journal entry
      return Journal.findByIdAndUpdate(id, update, { new: true });
    })
    .then((updatedEntry) => {
      res.send(updatedEntry);
    })
    .catch((err) => {
      console.error("Error updating journal entry:", err.message);
      res.sendStatus(500);
    });
});

// Delete a journal entry
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; // Ensure the user owns the entry

  if (!isValidObjectId(id)) {
    return res.status(400).send({ error: "Invalid journal entry ID." });
  }

  // Verify that the userId matches the entry's userId
  if (userId && !isValidObjectId(userId)) {
    return res.status(400).send({ error: "Invalid userId." });
  }

  Journal.findById(id)
    .then((entry) => {
      if (!entry) {
        throw new Error("Journal entry not found.");
      }

      if (userId && entry.userId.toString() !== userId) {
        throw new Error("Unauthorized to delete this journal entry.");
      }

      return Journal.findByIdAndDelete(id);
    })
    .then((deletedEntry) => {
      res.send({ message: "Journal entry deleted successfully." });
    })
    .catch((err) => {
      console.error("Error deleting journal entry:", err.message);
      res.status(500);
    });
});

module.exports = router;

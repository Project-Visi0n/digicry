/* eslint-disable consistent-return */
const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const language = require("@google-cloud/language");
const { Journal, User } = require("../models");

const client = new language.LanguageServiceClient();

// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper function to convert Natural Language sentimentScore & sentimentMagnitude into more human readable values
const sentimentConverter = () => {

}

// Create new journal entry
router.post("/", (req, res) => {
  console.log("[DEBUG] Incoming POST request:", req.body);
  const { userId, title, content, mood } = req.body;

  // Validate required fields
  if (!userId || !isValidObjectId(userId)) {
    console.log("[DEBUG] Invalid userId:", userId);
    return res.sendStatus(400);
  }

  if (!title || typeof title !== "string" || title.trim() === "") {
    return res.sendStatus(400);
  }

  if (!content || typeof content !== "string" || content.trim() === "") {
    return res.sendStatus(400);
  }

  if (!mood || !["😊", "😐", "😢", "😡", "😴"].includes(mood)) {
    console.log("[DEBUG] Missing fields:", { title, content, mood });
    return res.sendStatus(400);
  }

  // Concatenate post title & post content - separate with new line to help GNL parse accurately
  const analyzeText = `Post Title: ${title}\n  Post Content: ${content}`;

  // Call Google NLP
  const document = {
    content: analyzeText,
    type: "PLAIN_TEXT",
  };

  client
    .analyzeSentiment({ document })
    .then((results) => {
      // results[0] is sentiment response
      const sentiment = results[0].documentSentiment;

      // Check if user exists
      return User.findById(userId).then((user) => {
        if (!user) {
          throw new Error("User not found.");
        }

        // Create new journal entry (with sentiment data)
        const newEntry = new Journal({
          userId,
          title: title.trim(),
          content: content.trim(),
          mood,
          sentimentScore: sentiment.score,
          sentimentMagnitude: sentiment.magnitude,
        });
        return newEntry.save();
      });
    })
    .then((savedEntry) => {
      console.log("[DEBUG] Entry saved with sentiment:", savedEntry);
      return res.status(201).send(savedEntry);
    })
    .catch((err) => {
      console.error(
        "Error creating journal entry with sentiment:",
        err.message,
      );
      return res.sendStatus(500);
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

// Retrieve a single journal entry
router.get("/:id", (req, res) => {
  console.log("[DEBUG] GET single entry, ID:", req.params.id);
  // Extract the id from req.params
  const { id } = req.params;

  // Validate id is a valid mongoose ObjectId
  if (!isValidObjectId(id)) {
    console.log("[DEBUG] Invalid ObjectId");
    return res.sendStatus(400);
  }

  // Use findById to get the entry from the database
  Journal.findById(id)
    .then((entry) => {
      if (!entry) {
        console.log("[DEBUG] No entry found with that ID");
        return res.sendStatus(404);
      }
      console.log("[DEBUG] Single entry found:", entry);
      res.send(entry);
    })
    .catch((err) => {
      console.error("[DEBUG] Error fetching single entry:", err.message);
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

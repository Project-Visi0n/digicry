/* eslint-disable consistent-return */
const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const language = require("@google-cloud/language");
const { Journal, User } = require("../models");

const client = new language.LanguageServiceClient();

// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);


/**
 * This file handles the CRUD operations of Journal entries with integrated sentiment analysis via Google's Natural Language (GNL) API.
 * GNL analyzes the title and body content of journal entries and responds with raw sentiment scores.
 * Ex: { sentimentScore: 0.13494829, magnitudeScore: 13.03938449 }
 * We convert the raw sentiment score into a normalized value on a 0-100 scale.
 * The normalized score value is added to the normalizedSentiment property in the DB.
 *
 * Helpful Links:
 * https://developers.google.com/machine-learning/crash-course/numerical-data/normalization
 * https://www.indeed.com/career-advice/career-development/normalization-formula
 * https://medium.com/@chuntcdj/feature-normalization-the-essential-step-in-machine-learning-when-dealing-with-numbers-03030aaed65e
 */



/**
 * This function converts Google's NLP's raw sentiment into a normalized value on a 0-100 scale
 * Lower numbers represent negative sentiment
 * Middle numbers represent neutral sentiment
 * Higher numbers represent positive sentiment
 *
 * @param sentiment - Raw sentiment score from Google NLP. Represents positive/negative sentiment. Ranges from -1 to 1.
 * @param magnitude - Raw magnitude score from Google NLP. Represents intensity of emotion. Ranges from 0 to 100.
 * @param userId - Id of the user in DB
 * @returns {Promise<number>}
 *
 *
 * This function uses getRanges() function to get sentimentScore ranges from User's previous journal entries.
 * Then, we normalize sentimentScore and magnitudeScore to 0-1 scale using min-max normalization.
 * Then we apply a 70% weight to sentiment (indicator of positive/negative) and a 30% weight to magnitude (emotional intensity).
 * The function then scales the result to a 0-100 range.
 *
 *
 */
const sentimentConverter = async (sentiment, magnitude, userId) => {


  try {
    // Get ranges for this user's sentimentScores in DB, if User hasn't submitted enough journal entries then our default ranges will be used.
    const ranges = await getRanges(userId);
    // Normalize data using min-max scaling (x - min) / (max - min)
    const normalizedSentiment = (sentiment - ranges.sentimentMin) / (ranges.sentimentMax - ranges.sentimentMin);
    const normalizedMagnitude = (magnitude - ranges.magnitudeMin) / (ranges.magnitudeMax - ranges.magnitudeMin);


    // Initialize weights and scale to 0-100
    const sentimentWeight = 0.70;
    const magnitudeWeight = 0.30;
    return Math.round((normalizedSentiment * sentimentWeight + normalizedMagnitude * magnitudeWeight) * 100)

  } catch (error) {
    console.error('Error converting sentiment values', error);

    // Resort to use default ranges on error - these values are based on our analysis of test data (small data set! so not super accurate)
    const normalizedSentiment = (sentiment - (-0.7)) / (0.9 - (-0.7));
    const normalizedMagnitude = (magnitude - 0.5) / (13 - 0.5);
    return Math.round((normalizedSentiment * 0.70 + normalizedMagnitude * 0.30) * 100);
  }
}




/**
 * This function queries the DB to find the range of sentiment scores for a User.
 * This will normalize the scores within the context of a User's emotional expression patterns.
 *
 * @param userId - Id of the user in DB
 * @returns {Promise<{sentimentMin: number, sentimentMax: number, magnitudeMin: number, magnitudeMax: number}>} - Object containing min/max values for sentiment and magnitude
 *
 * Will resort to defaults for min/max values if User does not have 10+ journal entries in DB (insufficient data)
 */
const getRanges = async (userId) => {
  const defaults = {
    sentimentMin: -0.7,
    sentimentMax: 0.9,
    magnitudeMin: 0.5,
    magnitudeMax: 13,
  }

  // Initialize ranges with impossible values to ensure first comparison works
  const ranges = {
    sentimentMin: 2,
    sentimentMax: -2,
    magnitudeMin: 101,
    magnitudeMax: 0,
  };


  try {
    // Get all journal entries for User
    const journals = await Journal.find({ userId });

    // If insufficient data, return defaults
    if (journals.length < 10) {
      return defaults;
    }


    // Find min/max values from User's past journal entries
    journals.forEach(journal => {
      if (journal.sentimentScore < ranges.sentimentMin) {
        ranges.sentimentMin = journal.sentimentScore;
      }
      if (journal.sentimentScore > ranges.sentimentMax) {
        ranges.sentimentMax = journal.sentimentScore;
      }
      if (journal.sentimentMagnitude < ranges.magnitudeMin) {
        ranges.magnitudeMin = journal.sentimentMagnitude;
      }
      if (journal.sentimentMagnitude > ranges.magnitudeMax) {
        ranges.magnitudeMax = journal.sentimentMagnitude;
      }
    });

    return ranges;

  } catch (error) {
    console.error('Error getting User min/max sentimentScores - using default min/max values instead.', error);
    return defaults;
  }
}

// Create new journal entry
router.post("/", async (req, res) => {

  try {
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


    // Concatenate post title & post content - separate with new line to help GNL analyze all content accurately
    const analyzeText = `Post Title: ${title}\n  Post Content: ${content}`;

    // Initialize NLP request
    const document = {
      content: analyzeText,
      type: "PLAIN_TEXT",
    };

    // Get sentiment analysis from Google NLP
    const analyzeSentiment = await client.analyzeSentiment({ document });
    const sentiment = analyzeSentiment[0].documentSentiment;

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Create new journal entry (with sentiment data)
    const newEntry = new Journal({
      userId,
      title: title.trim(),
      content: content.trim(),
      mood,
      normalizedSentiment: await sentimentConverter(sentiment.score, sentiment.magnitude, userId),
      sentimentScore: sentiment.score,
      sentimentMagnitude: sentiment.magnitude,

    });
    console.log(`This is newEntry: ${newEntry}`);
    const savedEntry = await newEntry.save();
    console.log("[DEBUG] Entry saved with sentiment:", savedEntry);
    return res.status(201).send(savedEntry);

  } catch (error) {
    console.error('Error creating journal entry with sentiment:', error.message);
    return res.sendStatus(500);

  }
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
      res.send({
        message: "Journal entry deleted successfully:",
        deletedEntry,
      });
    })
    .catch((err) => {
      console.error("Error deleting journal entry:", err.message);
      res.status(500);
    });
});

module.exports = router;

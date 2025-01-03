/* eslint-disable consistent-return */
const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const language = require("@google-cloud/language");
const { Journal, User } = require("../models");

const client = new language.LanguageServiceClient();

// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);










// Helper function to normalize the sentimentScore and sentimentMagnitude into a 1-100 value where smaller numbers represent negative sentiment while larger numbers represent positive sentiment

/**
 *
 * Helpful Links:
 * https://developers.google.com/machine-learning/crash-course/numerical-data/normalization
 * ^ see linear scaling alg for more info
 * https://www.indeed.com/career-advice/career-development/normalization-formula
 * https://medium.com/@chuntcdj/feature-normalization-the-essential-step-in-machine-learning-when-dealing-with-numbers-03030aaed65e
 *
 *
 *
 * Ranges from our test data:
 * magnitude: 0.5 -> 13
 * sentiment: -0.7 -> 0.9
 *
 * first step is to normalize this data to get a value between 0 and 1
 * then assign values for magnitude and sentiment's 'weight' to decide the value priority of each
 *
 * the results from our test data (small sample size fyi) imply that magnitude can vary greatly
 * thus, i'll be giving sentiment a weight of 75% and magnitude a weight of 25%
 *
 * our goal is to get a convertedScore that ranges from 0-100, taking into account 25% of the weighted value and 75% of the sentiment value
 *
 *
 */

const sentimentConverter = async (sentiment, magnitude, userId) => {


  try {
    const ranges = await getRanges(userId);
    // normalize data via linear scaling
    const normalizedSentiment = (sentiment - ranges.sentimentMin) / (ranges.sentimentMax - ranges.sentimentMin);
    const normalizedMagnitude = (magnitude - ranges.magnitudeMin) / (ranges.magnitudeMax - ranges.magnitudeMin);


    // init weight values
    const sentimentWeight = 0.70;
    const magnitudeWeight = 0.30;
    console.log('WE GOT THE RANGES: ', normalizedMagnitude, normalizedSentiment)

    return Math.round((normalizedSentiment * sentimentWeight + normalizedMagnitude * magnitudeWeight) * 100)

  } catch (error) {
    console.error('Error converting sentiment values', error);

    // resort to use defaults on err
    const normalizedSentiment = (sentiment - (-0.7)) / (0.9 - (-0.7));
    const normalizedMagnitude = (magnitude - 0.5) / (13 - 0.5);
    return Math.round((normalizedSentiment * 0.70 + normalizedMagnitude * 0.30) * 100);
  }

}

// Helper function to query DB to get the ranges for sentiment & magnitude - defaults to ranges found in our test data
const getRanges = async (userId) => {
  // will use defaults if not enough data found in db
  const defaults = {
    sentimentMin: -0.7,
    sentimentMax: 0.9,
    magnitudeMin: 0.5,
    magnitudeMax: 13,
  }


  const ranges = {
    sentimentMin: 2,
    sentimentMax: -2,
    magnitudeMin: 101,
    magnitudeMax: 0,
  };



  try {
    const journals = await Journal.find({ userId });

    // if we dont have enough data resort to defaults
    if (journals.length < 10) {
      return defaults;
    }


    // find min/max values of score and magnitude
    // sentiment range is -1 -> 1, so it can never be 2 or -2
    // same logic applies for magnitude
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



    console.log('Base min/max values found!')

    return ranges;

  } catch (error) {
    console.error('Error getting base min/max values', error);
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


    // Concatenate post title & post content - separate with new line to help GNL parse accurately
    const analyzeText = `Post Title: ${title}\n  Post Content: ${content}`;

    // Call Google NLP
    const document = {
      content: analyzeText,
      type: "PLAIN_TEXT",
    };

    const analyzeSentiment = await client.analyzeSentiment({ document });
    // results[0] is sentiment response
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

    console.log('This should be the converted value', newEntry.normalizedSentiment);

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
      res.send({ message: "Journal entry deleted successfully." });
    })
    .catch((err) => {
      console.error("Error deleting journal entry:", err.message);
      res.status(500);
    });
});

module.exports = router;

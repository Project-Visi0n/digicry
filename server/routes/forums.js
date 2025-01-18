const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const { Forums } = require("../models");
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Creates a post and saves it to Forums model, sets an expiration date of 3 days

router.post("/", (req, res) => {
  const { message, selectedGoal } = req.body;
  const noSpacesGoal = selectedGoal.split(" ").join("");
  const date = new Date();

  // Add a day
  const expiration = date.setDate(date.getDate() + 3);

  if (noSpacesGoal !== "?") {
    Forums.create({
      forumName: noSpacesGoal,
      user: "anon",
      message,
      upVote: 0,
      downVote: 0,
      expireAt: expiration,
    })
      .then(() => {
        res.sendStatus(201);
      })
      .catch((error) => {
        console.error(error, "failed to create forum");
        res.sendStatus(500);
      });
  } else {
    res.sendStatus(404);
  }
});

// Ai goal post
router.get("/ai", async (req, res) => {
  const { query } = req;

  const genAI = new GoogleGenerativeAI(process.env.AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = `How can I take a step closer to acheiving my goals of ${query.msg} today?`;
  
  const result = await model.generateContent(prompt);
  res.send(result.response.text()).status(200);


});


// Gets all posts from forums based on query

router.get("/", (req, res) => {
  const { query } = req;
  Forums.find({ forumName: query.forumName })
    .then((posts) => {
      if (posts.length > 0) {
        res.status(200).send(posts);
      } else {
        const fakeDate = new Date();
        res.send([
          {
            forumName: query.forumName,
            user: "anon",
            message: "No posts have been made here yet!",
            upVote: 0,
            downVote: 0,
            createdAt: fakeDate.getDate(),
          },
        ]);
      }
    })
    .catch((error) => {
      console.error(`ERROR: ${error} Cannot get ${query} from DB`);
      res.send(500);
    });
});

// Updates the like status of a post

router.post("/like", (req, res) => {
  const { postId, liked } = req.body;
  Forums.findByIdAndUpdate(postId, {
    $inc: {
      upVote: liked ? -1 : 1,
    },
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error(error, "failed to upvote");
      res.sendStatus(500);
    });
});

// Updates the dislike status of a post

router.post("/dislike", (req, res) => {
  const { postId, disliked } = req.body;
  Forums.findByIdAndUpdate(postId, {
    $inc: {
      downVote: disliked ? 1 : -1,
    },
  })
    .then(() => {
      res.sendStatus(201);
    })
    .catch((error) => {
      res.sendStatus(500);
    });
});

module.exports = router;

const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const { Forums } = require("../models");

router.post("/", (req, res) => {
  console.log("reached");
  const { message, selectedGoal } = req.body;

  Forums.create({
    forumName: selectedGoal,
    user: "anon",
    message,
    upVote: 0,
    downVote: 0,
  })
    .then(() => {
      console.log("successful creation");
      res.sendStatus(201);
    })
    .catch((error) => {
      console.error(error, "failed to create forum");
      res.sendStatus(500);
    });
});

router.get("/", (req, res) => {
  console.log("getting posts for ", req.query.forumName);
  const { query } = req;
  Forums.find({ forumName: query.forumName })
    .then((posts) => {
      if (posts.length > 0) {
        console.log(posts)
        res.status(200).send(posts);
      } else {
        res.status(404);
      }
    })
    .catch((error) => {
      console.error(`ERROR: ${error} Cannot get ${query} from DB`);
      res.send(500);
    });
});

module.exports = router;

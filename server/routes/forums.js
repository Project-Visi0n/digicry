const express = require("express");

const router = express.Router();
const mongoose = require("mongoose");
const { Forums } = require("../models");

router.post("/", (req, res) => {
  console.log("reached");
  res.status(201);
});

router.get("/", (req, res) => {
  console.log("getting posts");
  const { query } = req;
  Forums.find({ forumName: query.forumName })
    .then((posts) => {
      if (posts.length > 0) {
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

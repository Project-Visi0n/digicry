const express = require("express");

const router = express.Router();

const Prompt = require("../models/Prompt");

//  Create (save a prompt)
router.post("/", async (req, res) => {
  try {
    const newPrompt = new Prompt({ text: req.body.text });
    const saved = await newPrompt.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: "Failed to save prompt"});
  }
});

//  Read (get all prompts already saved)

router.get("/", async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.json(prompts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// Delete (delete favorited prompts)

router.delete("/:id", async (req, res) => {
  try {
    await Prompt.findIdAndDelete(req.params.id);
    res.status(204).end();
  } catch(err) {
    res.status(200).json({ error: 'Failed to delete prompts'});
  }
});

module.exports = router;
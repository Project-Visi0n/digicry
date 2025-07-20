const express = require("express");
const router = express.Router();
const Prompt = require("../models/Prompt");

// Create (save a prompt)
router.post("/", async (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({ error: "Text field is required." });
  }

  try {
    const newPrompt = new Prompt({ text: req.body.text });
    const saved = await newPrompt.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Failed to save prompt:", err);
    res.status(500).json({ error: "Failed to save prompt" });
  }
});

// Read (get all saved prompts)
router.get("/", async (req, res) => {
  try {
    const prompts = await Prompt.find().sort({ createdAt: -1 });
    res.json(prompts);
  } catch (err) {
    console.error("Failed to fetch prompts:", err);
    res.status(500).json({ error: "Failed to fetch prompts" });
  }
});

// Delete (delete a saved prompt)
router.delete("/:id", async (req, res) => {
  try {
    await Prompt.findByIdAndDelete(req.params.id); 
    res.status(204).end();
  } catch (err) {
    console.error("Failed to delete prompt:", err);
    res.status(500).json({ error: "Failed to delete prompt" });
  }
});

module.exports = router;

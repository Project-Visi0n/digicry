const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/prompt', async (req, res) => {
  console.log("🔥 /api/ai/prompt route was HIT");

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: "Give me one short reflective journal prompt that fits in my textbox and encourages thought self-expression of the user."
              }
            ]
          }
        ]
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const prompt = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("✅ Gemini response:", prompt);
    res.json({ prompt: prompt || "Default prompt." });
  } catch (err) {
    console.error("💥 Gemini error:", err.response?.data || err.message);
    res.status(500).json({ prompt: "Error generating prompt." });
  }
});

module.exports = router;

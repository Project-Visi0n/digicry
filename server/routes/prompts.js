const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/prompts', async (req, res) => {
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!geminiKey) {
    return res.status(500).send({ prompt: "Server misconfiguration: API key missing." });
  }

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
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
      {
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": geminiKey
        }
      }
    );

    const prompt = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.send({ prompt: prompt || "Describe your day." });

  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    res.status(500).send({ prompt: "Can not generate a prompt right now" });
  }
});

module.exports = router;

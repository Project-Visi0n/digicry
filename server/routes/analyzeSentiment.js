const express = require("express");
const router = express.Router();
const language = require('@google-cloud/language');

router.post('/analyze', async (req, res) => {
  try {
    // Instantiates a client
    const client = new language.LanguageServiceClient();
    // The text to analyze
    const text = 'Today has sucked! I hate everyone! This is a very angry message!';
    const document = {
      content: text,
      type: 'PLAIN_TEXT',
    };
    // Detects the sentiment of the text
    const [result] = await client.analyzeSentiment({ document: document })
    const sentiment = result.documentSentiment;

    console.log(`Text: ${text}`);
    console.log(`Sentiment score: ${sentiment.score}`);
    console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
    res.json(sentiment);


  } catch (error) {
    console.error(error);
    res.status(500);
  }
})

module.exports = router;

const express = require("express");
const router = express.Router();
const axios = require("axios");
const language = require('@google-cloud/langauge');
const { LanguageServiceClient } = require('@google-cloud/language').v1;

router.post('/api/analyze', async (req, res) => {
  const client = new language.LanguageServiceClient();
  const text = 'Hello, world!';

  const document = {
    content: text,
    type: 'PLAIN_TEXT',
  };

  const [result] = await client.analyzeSentiment({ document: document })
  const sentiment = result.documentSentiment;

  console.log(`Text: ${text}`);
  console.log(`Sentiment score: ${sentiment.score}`);
  console.log(`Sentiment magnitude: ${sentiment.magnitude}`);
})



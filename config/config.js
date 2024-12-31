require("dotenv").config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://127.0.0.1:${PORT}`;

module.exports = {
  PORT,
  BASE_URL,
};
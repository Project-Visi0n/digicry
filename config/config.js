require("dotenv").config();

const PORT = process.env.PORT || 5000;
const BASE_URL = `http://localhost:${PORT}`;

module.exports = {
  PORT,
  BASE_URL,
};
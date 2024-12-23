const mongoose = require("mongoose");

const { Schema } = mongoose;

const federated_credentialsSchema = new Schema({
  user_id: Number,
  provider: String,
  subject: String,
});

const Federated_Credentials = mongoose.model(
  "Federated_Credentials",
  federated_credentialsSchema
);

module.exports = Federated_Credentials;

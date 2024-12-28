// Barrel file to export all models
const User = require("./User");
const Journal = require("./Journal");
const Federated_Credentials = require("./Federated_Credentials");
const Event = require("./Event");

module.exports = {
  User,
  Journal,
  Federated_Credentials,
  Event,
};

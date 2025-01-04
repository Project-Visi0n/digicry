/* eslint-disable camelcase */
// Barrel file to export all models
const User = require("./User");
const Journal = require("./Journal");
const Federated_Credentials = require("./Federated_Credentials");
const Forums = require("./Forums");

module.exports = {
  User,
  Journal,
  Federated_Credentials,

  Forums,
};

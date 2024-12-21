const mongoose = require('mongoose');
const { Schema, model } = mongoose;
//Schemas Below this line
const usersSchema = new Schema({

  username: String,
  hashed_password: String,
  salt: String,
  name: String,
  location: String,

})
//
const federated_credentialsSchema = new Schema({

  user_id: Number,
  provider: String,
  subject: String,

})


//Models below this line

const Federated_Credentials = mongoose.model('Federated_Credentials', federated_credentialsSchema);
const User = mongoose.model('User', usersSchema)

//Connecting to mongodb database


mongoose.connect('mongodb//localhost:27017/digicry')
.then(() => {
  console.log('Connected to the database successfully')
})
.catch(() => {
  console.log('Failed to connect to the database! ')
})


//Exports go here

module.exports = { Federated_Credentials, User };
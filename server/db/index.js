const mongoose = require('mongoose');

//Schemas Below this line



//Models below this line




//Connecting to mongodb database
mongoose.connect('mongodb//localhost:27017//digicry')
.then(() => {
  console.log('Connected to the database successfully')
})
.catch(() => {
  console.log('Failed to connect to the database! ')
})

//Exports go here
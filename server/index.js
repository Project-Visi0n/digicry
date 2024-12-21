const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRouter = require('./routes/auth');
const session = require('express-session');
const passport = require('passport'); require('./routes/auth.js')
const LocalStrategy = require('passport-local').Strategy;
const User = require('./db/index.js')
const MongoStore = require('connect-mongo');
//TODO: require { obj } for endpoint root route

dotenv.config();

const PORT = process.env.PORT || 5000;

// Create an instance of Express
const app = express();

// Middleware
app.use(passport.initialize());
//app.use(passport.session());
app.use(cors());
app.use(express.json());  // Parse the request body
//app.use(express.static()) //TODO:
app.use('/auth', authRouter);
app.use(
  session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: 'mongodb://localhost:27017/digicry',
    }),
  })
);
// Routers




// Root Route
app.get('/', (req, res) => {
  res.send('Welcome to Digi-Cry Backend!');
  //TODO: add endpoint
});

// Start Sever
app.listen(PORT, () => {
  console.log(`Listening at: http://127.0.0.1:${PORT}`);
});
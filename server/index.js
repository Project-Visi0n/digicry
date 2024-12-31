const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
dotenv.config();

// Import database connection and models
const connectDB = require("./db/index");
const { User } = require("./models");

// Import Routes
const journalRoutes = require("./routes/journal");
const eventRoutes = require("./routes/event");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create an instance of Express
const app = express();

// Middleware

// Parse JSON bodies
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: `http://localhost:8080`,
    credentials: true,
  })
);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "../dist")));

// We set passport up to use the 'Google Strategy'. Each 'strategy' is an approach
// used for logging into a certain site. The Google Strategy needs an object with the
// client ID, clientSecret, CallbackURL, and an async callback function that will call
// 'next' or 'done' once it is finished. The function automatically receives 2 tokens and
// a profile.

// this sets it up so that each session gets a cookie with a secret key
app.use(
  session({
    // creates a new 'session' on requests
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // creates req.session.cookie will only be alive for 1 hour ( maxAge is a timer option = 1000ms . 60 . 60 = 1 hr. )
  })
);

// set up passport
app.use(passport.initialize());
app.use(passport.session());

// Passport Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: `${process.env.CALLBACK_URL}`,
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      return done(null, profile);
    }
  )
);

// save user info session as a cookie
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Quotes endpoint
app.get("/api/stoic-quote", async (req, res) => {
  try {
    const response = await axios.get("https://stoic.tekloon.net/stoic-quote");
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching quote:", error.message);
    res.status(500);
  }
});

// Routes

// Root Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// Journal Route
app.use("/api/journal", journalRoutes);

// Events Route
app.use("/api/events", eventRoutes);

// Reverse Geolocation w/ Google Maps API
const geoLocation = require('./routes/event.js');
app.use('/api/geolocate', geoLocation);


// Log in with google route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] }),
);


// If there is a session on the request, find or create the user's corresponding model. 

app.get("/check-session", (req, res) => {
  const key = Object.keys(req.sessionStore.sessions);
  const reqSessions = JSON.parse(req.sessionStore.sessions[key[0]]);
  const {
    passport: { user: googleUser },
  } = reqSessions;

  User.find({ oAuthId: googleUser.id })
    .then((user) => {
      if (user.length === 0) {
        User.create({
          username: googleUser.displayName,
          name: googleUser.displayName,
          location: "unknown",
          oAuthId: googleUser.id,
        });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((error) => {
      console.error(error, "Check-Session Error, User Not Found");
      res.sendStatus(500);
    });
});

// Callback route for google to redirect to
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:8080/");
    // only use ngrok for local HTTPS testing
    // res.redirect('https://3686-72-204-159-97.ngrok-free.app/')
  }
);

// logout the user
app.get("/logout", function (req, res) {
  req.logout(async function (err) {
    if (err) {
      console.error(err, "Error in request logout in server");
      res.send(500);
    }
    await req.session.destroy();
    await req.sessionStore.clear();
    res.redirect("http://localhost:8080/");
    // only use ngrok for local HTTPS testing
    // res.redirect('https://3686-72-204-159-97.ngrok-free.app/')

  });
});


// Start Sever
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port: ${PORT}`);
});

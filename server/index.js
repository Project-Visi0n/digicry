const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const axios = require("axios");

// Import database connection and models
const connectDB = require("./db/index");
const { User } = require("./models");

// Import Routes
const journalRoutes = require("./routes/journal");

dotenv.config();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create an instance of Express
const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies
// TODO: app.use(express.static('/dist'))

// We set passport up to use the 'Google Strategy'. Each 'strategy' is an approach
// used for logging into a certain site. The Google Strategy needs an object with the
// client ID, clientSecret, CallbackURL, and an async callback function that will call
// 'next' or 'done' once it is finished. The function automatically receives 2 tokens and
// a profile.

// this sets it up so that each session gets a cookie with a secret key
app.use(
  session({ // creates a new 'session' on requests
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
    cookie: { maxAge: 1000 * 60 * 60 }, // creates req.session.cookie will only be alive for 1 hour ( maxAge is a timer option = 1000ms . 60 . 60 = 1 hr. )
  }),
);

// set up passport
app.use(passport.initialize());
app.use(passport.session());

// CORS configuration
app.use(
  cors({
    origin: `http://localhost:3000`,
    credentials: true,
  }),
);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "../dist")));

// Passport Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: `${process.env.CALLBACK_URL}`,
    },
    async (accessToken, refreshToken, profile, done) => {
      // Method to create or authenticate use in our DB
      return done(null, profile);
    },
  ),
);

// Create  anew user
// user = new User({
//   googleId: profile.id,
//   name: profile.displayName,
// });

// save user info session as a cookie
passport.serializeUser((user, done) => {
  console.log(user, "this is the user");
  console.log(done);
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

// Journal Routes
app.use("api/journal", journalRoutes);

// Root Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// Log in with google route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

// Callback route for google to redirect to
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("http://localhost:8080");
  },
);

// Display user profile
app.get("/profile", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(
      `<h1>You logged in<h1><span>${JSON.stringify(req.user, null, 2)}<span>`,
    );
  } else {
    res.redirect("/");
  }
});

// logout the user
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Start Sever
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port: ${PORT}`);
});

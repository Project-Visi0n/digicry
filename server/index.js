const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const cookieParser = require('cookie-parser');

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

app.use((req, res, next) => {
  console.log("[DEBUG] Incoming request:", req.method, req.url, req.body);
  next();
});

// CORS configuration
app.use(
  cors({
    origin: "http://localhost:8080", // Your frontend URL
    credentials: true, // Allow cookies to be sent
  }),
);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "../dist")));

// We set passport up to use the 'Google Strategy'. Each 'strategy' is an approach
// used for logging into a certain site. The Google Strategy needs an object with the
// client ID, clientSecret, CallbackURL, and an async callback function that will call
// 'next' or 'done' once it is finished. The function automatically receives 2 tokens and
// a profile.

// This sets it up so that each session gets a cookie with a secret key
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: true,
    saveUninitialized: false, // Only save sessions when they have data
    cookie: {
      httpOnly: true,
      secure: false, // Set `true` if using HTTPS
      maxAge: 60 * 60 * 1000, // 1 hour
    },
  }),
);

// Set up passport
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Passport Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        console.log("[DEBUG] Google Profile:", profile);

        // Check if the user exists in the database
        let user = await User.findOne({ oAuthId: profile.id });

        // If user doesn't exist, create a new one
        if (!user) {
          user = await User.create({
            username: profile.displayName,
            oAuthId: profile.id,
          });
        }

        // Pass the user to Passport
        return done(null, user);
      } catch (err) {
        console.error("[DEBUG] Google Auth Error:", err);
        return done(err, null);
      }
    },
  ),
);

// Save user info session as a cookie
passport.serializeUser((user, done) => {
  console.log("[DEBUG] Serialize User:", user);
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  console.log("[DEBUG] Deserialize User ID:", id);
  User.findById(id)
    .then((user) => {
      console.log("[DEBUG] User found during deserialization:", user);
      done(null, user);
    })
    .catch((err) => {
      console.error("[DEBUG] Error in deserialization:", err);
      done(err, null);
    });
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

// Proxy Test Route
app.get("/api/test", (req, res) => {
  res.json({ message: "Proxy is working!" });
});

// Journal Route
app.use("/api/journal", journalRoutes);

// Events Route
app.use("/api/events", eventRoutes);

// Log in with google route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] }),
);

// If there is a session on the request, find or create the user's corresponding model.

// Check session route
app.get("/check-session", (req, res) => {
  console.log('checking for existing sessions')
  const key = Object.keys(req.sessionStore.sessions);
  const reqSessions = JSON.parse(req.sessionStore.sessions[key[0]]);
  const {
    passport: { user: googleUser },
  } = reqSessions;

  User.find({ oAuthId: googleUser.id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ error: "User not found in database" });
      }
      return res.status(200).json(user);
    })
    .catch((error) => {
      console.error("[CHECK-SESSION] Error:", error.message);
      return res.sendStatus(500);
    });
});

// Callback route for google to redirect to
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    console.log('received')
    res.redirect("http://localhost:8080/");
  }
);

// logout the user
app.get("/logout", function (req, res) {
  console.log('logout received')
  req.logout(async function (err) {
    if (err) {
      console.error(err, "Error in request logout in server");
      return res.sendStatus(500);
    }
    await req.session.destroy();
    await req.sessionStore.clear();
    res.redirect("http://localhost:8080/");
  });
});

// Start Sever
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Listening on port: ${PORT}`);
});

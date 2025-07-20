const express = require("express");
const https = require("https");
const fs = require("fs");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const axios = require("axios");
const cookieParser = require("cookie-parser");

// Load environment variables
dotenv.config();

// Import database connection and models
const connectDB = require("./db/index");
const { User } = require("./models");

// Import Routes
const journalRoutes = require("./routes/journal");
const eventRoutes = require("./routes/event");
const forumRoutes = require("./routes/forums");
const geminiRoutes = require("./routes/ai");
const promptCrudRoutes = require("./routes/prompts");
const favoriteShapeComboRoutes = require("./routes/favoriteShapeCombos");
const shapesRoutes = require("./routes/shapes");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create Express app
const app = express();

// Session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 },
  })
);

// Body parser and cookie parser
app.use(express.json());
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

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

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

// Mount API routes (DO THIS BEFORE static assets!)
app.use("/api/ai", geminiRoutes);
app.use("/api/prompts", promptCrudRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/forums", forumRoutes);
app.use("/api/favorites", favoriteShapeComboRoutes);
app.use("/api/shapes", shapesRoutes);

// Test route
app.get("/api/test", (req, res) => {
  console.log(" /api/test was HIT");
  res.send("Test route works");
});

// Quote route
app.get("/api/stoic-quote", async (req, res) => {
  try {
    const response = await axios.get("https://stoic.tekloon.net/stoic-quote");
    res.send(response.data);
  } catch (error) {
    console.error("Error fetching quote:", error.message);
    res.status(500).send("Failed to fetch quote");
  }
});

// Google Auth Routes
app.get("/auth/google", passport.authenticate("google", { scope: ["profile"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect(process.env.HOME_URL);
  }
);

// Logout
app.get("/logout", async function (req, res) {
  try {
    await req.logout(() => {});
    await req.session.destroy();
    await req.sessionStore.clear();
    res.redirect(process.env.HOME_URL);
  } catch (err) {
    console.error(err, "Error in logout");
    res.sendStatus(500);
  }
});

// Session check
app.get("/check-session", (req, res) => {
  if (!req.user || !req.user.id) {
    console.warn("[DEBUG] No user session found");
    return res.status(401).send({ error: "User not authenticated" });
  }

  User.findOne({ oAuthId: req.user.id })
    .then((foundUser) => {
      if (!foundUser) {
        return User.create({
          username: req.user.displayName,
          name: req.user.displayName,
          location: "unknown",
          oAuthId: req.user.id,
        }).then((newUser) => res.status(200).send([newUser]));
      }
      return res.status(200).send([foundUser]);
    })
    .catch((error) => {
      console.error("Check-Session Error:", error);
      res.sendStatus(500);
    });
});

// Serve static frontend (AFTER routes)
app.use(express.static(path.join(__dirname, "../dist")));

// Fallback to frontend app
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// Start server
if (process.env.DEPLOYMENT === "true") {
  const options = {
    cert: fs.readFileSync("/etc/ssl/certs/slayer.events/fullchain1.pem"),
    key: fs.readFileSync("/etc/ssl/certs/slayer.events/privkey1.pem"),
  };
  https.createServer(options, app).listen(443);
} else {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on port: ${PORT}`);
  });
}

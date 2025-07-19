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
const favoriteShapeComboRoutes = require("./routes/favoriteShapeCombos");
const shapesRoutes = require("./routes/shapes");

dotenv.config();

// Import database connection and models
const connectDB = require("./db/index");
const { User } = require("./models");

// Import Routes
const journalRoutes = require("./routes/journal");
const eventRoutes = require("./routes/event");

const forumRoutes = require("./routes/forums");
const promptRoutes = require("./routes/prompts");

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Create an instance of Express
const app = express();


// Start server
if (process.env.DEPLOYMENT === "true") {
  // HTTPS / SSL CONFIG
  const options = {
    cert: fs.readFileSync("/etc/ssl/certs/slayer.events/fullchain1.pem"),
    key: fs.readFileSync("/etc/ssl/certs/slayer.events/privkey1.pem"),
  };
  https.createServer(options, app).listen(443);
} else {
  // Start Local Server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on port: ${PORT}`);
  });
}

// Middleware

// This sets it up so that each session gets a cookie with a secret key
app.use(
  session({
    // Creates a new 'session' on requests
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 }, // Creates req.session.cookie will only be alive for 1 hour ( maxAge is a timer option = 1000ms . 60 . 60 = 1 hr. )
  }),
);

// Parse JSON bodies
app.use(express.json());

// CORS configuration
app.use(
  cors({
    origin: `http://localhost:8080`,
    credentials: true,
  }),
);

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "../dist")));

// We set passport up to use the 'Google Strategy'. Each 'strategy' is an approach
// used for logging into a certain site. The Google Strategy needs an object with the
// client ID, clientSecret, CallbackURL, and an async callback function that will call
// 'next' or 'done' once it is finished. The function automatically receives 2 tokens and
// a profile.


// Set up passport
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

// Passport Strategy
passport.use(
  new GoogleStrategy( // This object is sent to Google during signin. 
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: `${process.env.CALLBACK_URL}`,
      passReqToCallback: true, // Send req to the callback so we can keep the session!
    },
    async (req, accessToken, refreshToken, profile, done) => {
      return done(null, profile); // We opt to rely on the returned profile of the user, done is = "serializeUser"
    },
  ),
);

// Save user info session as a cookie
passport.serializeUser((user, done) => {
  done(null, user); // Send entire user object to be stored to session
});

passport.deserializeUser((user, done) => {
  done(null, user); // We do not use req.user in our program, as we save them to our database
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





// Forums Route
app.use("/api/forums", forumRoutes);

// Favorite Shape Combos Route
app.use("/api/favorites", favoriteShapeComboRoutes);

// Shapes Route
app.use("/api/shapes", shapesRoutes);

// Log in with google route
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] }), // Passport sends client to google, for Options, we designate we want their profile
);

// Prompts Route

app.use('/api/gemini', promptRoutes);

// If there is a session on the request, find or create the user's corresponding model. *Prevents us from needing req.user

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
        }).then((newUser) => {
          return res.status(200).send([newUser]);
        });
      }
      return res.status(200).send([foundUser]);
    })
    .catch((error) => {
      console.error(error, "Check-Session Error, User Not Found");
      res.sendStatus(500);
    });
});


// Callback route for google to redirect to

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }), // Client is sent to homepage WITHOUT tokens from google if they fail to connect
  (req, res) => {
    res.redirect(process.env.HOME_URL); // Send authenticated users to our homepage
  },
);

// logout the user
app.get("/logout", function (req, res) {
  req.logout(async function (err) {
    if (err) {
      console.error(err, "Error in request logout in server");
      res.send(500);
    }
    await req.session.destroy(); // Remove session on the request
    await req.sessionStore.clear(); // Clear the sessionStore history
    res.redirect(process.env.HOME_URL);
  });
});

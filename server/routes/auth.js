const express = require('express');
const dotenv = require('dotenv');

const passport = require('passport')
const router = express.Router();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
var db = require('../db');
const Federated_Credentials = require('../db/index.js');
const User = require("../db/index.js")
dotenv.config()


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  callbackURL: process.env.CALLBACK_URL,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
}, async (accessToken, refreshToken, profile, done) => {
  console.log("user profile is: ", profile)
  return done(err,  profile)
}));

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });
  // Federated_Credentials.findOneAndUpdate(
  //   { 
  //     provider: issuer, 
  //     subject: profile._id 
  //   }, 
  //   { 
  //     user_id: id , 
  //     provider: issuer , 
  //     subject: profile.displayName
  //    },
  //   {
  //     upsert: true,
  //     new: true,
  //   })
  // .then((matchingCredentials) => {
  //   console.log(matchingCredentials);
  // }).catch((err) => {
  //   console.error(err);
  // })
// }))

// passport.serializeUser(function(user, cb) {
//   process.nextTick(function() {
//     cb(null, { id: user.id, username: user.username, name: user.name });
//   });
// });

// passport.deserializeUser(function(user, cb) {
//   process.nextTick(function() {
//     return cb(null, user);
//   });
// });

// router.get('/oauth2/redirect/google', passport.authenticate('google', {
//   successRedirect: '/',
//   failureRedirect: '/login'
// }))
// .then(() => { 
//   res.sendStatus(200)
//  })
// .catch((err) => { 
//   console.error(err) 
// })

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



router.get('/', (req, res, next) => {
  res.render('login');
})

// router.get('/federated/google', passport.authenticate('google'))
// .then(() => { 
//   res.sendStatus(200)
//  })
// .catch((err) => { 
//   console.error(err) 
// })


module.exports = router;
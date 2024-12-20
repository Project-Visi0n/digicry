const express = require('express');
const passport = require('passport')
const router = express.Router();
const GoogleStrategy = require('passport-google-oidc');
var db = require('../db');
const Federated_Credentials = require('../db/index.js');


passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: [ 'profile' ]
}, function verify(issuer, profile, cb) {
  Federated_Credentials.findOneAndUpdate(
    { 
      provider: issuer, 
      subject: profile._id 
    }, 
    { 
      user_id: id , 
      provider: issuer , 
      subject: profile.displayName
     },
    {
      upsert: true,
      new: true,
    })
  .then((matchingCredentials) => {
    console.log(matchingCredentials);
  }).catch((err) => {
    console.error(err);
  })
}))

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username, name: user.name });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

router.post('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});



router.get('/login', (req, res, next) => {
  res.render('login');
})

router.get('/login/federated/google', passport.authenticate('google'));

module.exports = router;
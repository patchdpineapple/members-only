var express = require('express');
var router = express.Router();
const bcrypt = require("bcryptjs");

// Require controller modules.
var user_controller = require('../controllers/userController');

// setup session and passport
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// import models
var User = require('../models/user');

// Define strategy
passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
  
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // passwords match! log user in
            return done(null, user);
          } else {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" });
          }
        });
      });
    })
  );
  
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
});

router.use(passport.initialize());
router.use(passport.session());

// GET Home Page
router.get('/', user_controller.index);

// POST Login form
router.post('/log-in', user_controller.login_post);

// GET Logout
router.get("/log-out", user_controller.logout_get);

// GET Sign up form
router.get('/sign-up', user_controller.signup_get);

// POST Sign up form
router.post('/sign-up', user_controller.signup_post, user_controller.login_post);

module.exports = router;

const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const async = require("async");
var express = require('express');
var router = express.Router();

// Require models
var User = require('../models/user');
var Message = require('../models/message');

const passport = require("passport");

// MIDDLEWARE FUNCTIONS
// Display Home Page
exports.index = function(req, res, next) {
    Message.find({})
    .populate("author")
    .exec(function(err, messages){
        if(err) { return next(err); }
        res.render("index", { title: "All Messages", messages: messages, user: req.user });

    })
};

// Post login details
exports.login_post =  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/"
});

// Logout get
exports.logout_get =  function(req, res) {
    req.logout();
    res.redirect("/");
  };
    
// Get signup page
exports.signup_get = function(req, res) {
    res.render("signup_form", { title: "Signup", user: req.user });
};

// Post signup details
exports.signup_post = [
    (req, res, next) => {
        if(req.body.admin === undefined) {
            req.body.admin = "false";
        } else {
            req.body.admin = "true";
        } 
        next();
    },

    // validation and sanitization
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body("username").trim().isLength({min:1}).escape().withMessage('First name must be specified.'),
    body("password", "Password must not be empty").trim().isLength({min:1}).escape(),
    body("confirm", "Confirm Password must have same value as password field").exists()
        .custom((value, { req }) => value === req.body.password),
    body("admin").escape(),

    // Process request after validation and sanitization.
    (req, res, next) => {
        var errors = validationResult(req);

        const user = new User({
            first_name: req.body.first_name,
            family_name: req.body.family_name,
            username: req.body.username,
            password: req.body.password,
            admin: req.body.admin
        });

        if(!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render('signup_form', { title: 'Signup', user_signup: user, errors: errors.array() });
            return;
        } else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                // if err, do something
                if (err) {
                  return next(err);
                }
            
                // otherwise, store hashedPassword in DB
                user.password = hashedPassword;
                if(req.body.admin === "true") {
                    user.membership = "Exclusive";
                }
                user.save(function(err) {
                    if(err) { return next(err); }
                    // Successful - run next middleware to automatically login user
                    next();
                });
              });
        }
    }
]

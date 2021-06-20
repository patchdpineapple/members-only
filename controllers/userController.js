const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");


// Require models
var User = require('../models/user');

const async = require("async");

// Display Home Page
exports.index = function(req, res) {
    res.render("index", { title: "Home Page", user: req.user });
};

// Post login details
exports.login_post = [
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/"
      })
]

// Get signup page
exports.signup_get = function(req, res) {
    res.render("signup_form", { title: "Signup" });
};

// Post signup details
exports.signup_post = [
    // validation and sanitization
    body('first_name').trim().isLength({ min: 1 }).escape().withMessage('First name must be specified.')
        .isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
    body('family_name').trim().isLength({ min: 1 }).escape().withMessage('Family name must be specified.')
        .isAlphanumeric().withMessage('Family name has non-alphanumeric characters.'),
    body("username").trim().isLength({min:1}).escape().withMessage('First name must be specified.'),
    body("password", "Password must not be empty").trim().isLength({min:1}).escape(),
    body("confirm", "Confirm Password must have same value as password field").exists()
        .custom((value, { req }) => value === req.body.password),
    body("admin").escape()
        .customSanitizer( value => {
            if(value === "") {
                value = "false";
            }
        }),

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
                    // Successful - redirect to new author record.
                    res.redirect("/");
                });
              });
        }
    }
]

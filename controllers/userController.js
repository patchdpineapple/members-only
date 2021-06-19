const { body, validationResult } = require("express-validator");

// Require models
var User = require('../models/user');

const async = require("async");

// Display Home Page
exports.index = function(req, res) {
    res.render("index", { title: "Home Page" });
};

// Post login details
exports.login_post = function(req, res) {
    res.redirect("/");
};

// Get signup page
exports.signup_get = function(req, res) {
    res.render("signup_form", { title: "Signup" });
};

// Post signup details
exports.signup_post = function(req, res) {
    res.render("index", { title: "NOT YET IMPLEMENTED: Sign Up POST" });
};


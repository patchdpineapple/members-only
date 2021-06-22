const { body, validationResult } = require("express-validator");
const async = require("async");
var express = require('express');
var router = express.Router();

// Require models
var User = require('../models/user');
var Message = require('../models/message');


// MIDDLEWARE FUNCTIONS
// Display Message create page
exports.message_create_get = function(req, res, next) {
    res.render("message_form", { title: "New Message", user: req.user });
};

// Post new message
exports.message_create_post = [
    // validate and sanitize
    body("title", "Title must not be empty").trim().isLength({min:1}).escape(),
    body("text", "Message must not be empty").trim().isLength({min:1}).escape(),

    // Process request after validation and sanitization
    (req, res, next) => {
        var errors = validationResult(req);

        const message = new Message({
            title: req.body.title,
            text: req.body.text,
            timestamp: Date(),
            author: req.user._id
        });

        console.log(`title: ${req.body.title}`);
        console.log(`text: ${req.body.text}`);
        console.log(`message text: ${message.text}`);


        if(!errors.isEmpty()){
             // There are errors. Render form again with sanitized values/errors messages.
             res.render('message_form', { title: "New Message", message: message, user: req.user, errors: errors.array() });
             return;
        } else {
            message.save(function(err) {
                if(err) { return next(err); }
                // Successful - redirect to index
                res.redirect("/");
            });
        }
    }
]

exports.message_delete_get = function(req, res, next) {
    Message.findById(req.params.id)
    .populate("author")
    .exec(function(err, message){
        if(err) { return next(err); }
        if(message==null) {
            res.redirect('/');
        }
        // Success, render messae delete page
        res.render("message_delete", { title: "Delete Message", user: req.user, message: message })
    });
};

exports.message_delete_post = function(req, res, next) {
    Message.findByIdAndRemove(req.body.messageid, function deleteMessage(err) {
        if (err) { return next(err); }
        // Success - go to index
        res.redirect('/');
    });
};

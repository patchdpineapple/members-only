#! /usr/bin/env node

console.log('This script populates some users and messages to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/inventory_app?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var User = require("./models/user");
var Message = require("./models/message");

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var users = []
var messages = []

function userCreate( first_name, family_name, membership, username, password, admin, cb) {
  var userdetail = {
    first_name: first_name,
    family_name: family_name,
    membership: membership,
    username: username,
    password: password,
    admin: admin
  }

  var user = new User(userdetail);

  user.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New User: ' + user);
    users.push(user);
    cb(null, user);
  });
}

function messageCreate( title, text, timestamp, author, cb) {
  var messagedetail = {
    title: title,
    text: text,
    timestamp: timestamp,
    author: author,
  } 

  var message = new Message(messagedetail);

  message.save(function(err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Category: ' + message);
    messages.push(message);
    cb(null, message);
  });
}


function createUsers(cb) {
    async.series([
          function(callback) {
            userCreate("Test", "User", "Exclusive", "test", "test123", true, callback);
          },
          function(callback) {
            userCreate("John", "Doe", "Exclusive", "johndoe", "test123", false, callback);
          },
          function(callback) {
            userCreate("Boey", "Santos", "Basic", "boey", "test123", false, callback);
          }
        ],
        // optional callback
        cb);
}

function createMessages(cb) {
    async.series([
          function(callback) {
            messageCreate("New Admin", "Hi this is my first message as new admin", "2021-06-15", users[0], callback);
          },
          function(callback) {
            messageCreate("Which do you like?", "Hi this is my first message", "2021-06-16", users[1], callback);
          },
          function(callback) {
            messageCreate("Title noob", "Help me think of a title", "2021-06-17", users[2], callback);
          }
        ],
        // optional callback
        cb);
}

async.series([
  createUsers,
  createMessages,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('POPULATE DB SUCCESS');
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});





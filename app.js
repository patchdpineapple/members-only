require("dotenv").config();
const bcrypt = require("bcryptjs");
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// require session 
const session = require("express-session");

// import models
var User = require('./models/user');

// import routers
var indexRouter = require('./routes/index');
var clubRouter = require('./routes/club');
var compression = require('compression');
var helmet = require('helmet');

// create express app
var app = express();

// set appropriate HTTP headers 
app.use(helmet());

// setup mongoose connection
var mongoose = require("mongoose");
var dev_db_url = process.env.DB_URL;
var mongoDB = process.env.MONGODB_URI || dev_db_url;

mongoose.connect(mongoDB, { useNewUrlParser: true , useUnifiedTopology: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, 'MongoDB connection error:'))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Use session and passport middleware, define strrategy
app.use(session({ secret: process.env.SN_SCRT, resave: false, saveUninitialized: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set local variable for user
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

// Compress routes
app.use(compression());

// Routes
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/club', clubRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

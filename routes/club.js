var express = require('express');
var router = express.Router();

// Require controller modules.
var user_controller = require('../controllers/userController');

// GET Home Page
router.get('/', user_controller.index);

// POST Login form
router.post('/', user_controller.login_post);

// GET Sign up form
router.get('/sign-up', user_controller.signup_get);

// POST Sign up form
router.post('/sign-up', user_controller.signup_post);

module.exports = router;

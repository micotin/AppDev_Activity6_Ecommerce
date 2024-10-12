const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');
const authController = require('../controllers/authController');

// Landing page (index.ejs)
router.get('/', indexController.renderLandingPage);

// Signup and login routes
router.get('/signup', authController.renderSignupPage);
router.get('/login', authController.renderLoginPage);

// POST routes for signup and login forms
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Home page after login
router.get('/home', indexController.renderHomePage);


module.exports = router;

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Render signup page
router.get('/signup', authController.renderSignupPage);

// Handle signup logic
router.post('/signup', authController.signup);

// Render login page
router.get('/login', authController.renderLoginPage);

// Handle login logic
router.post('/login', authController.login);


module.exports = router;

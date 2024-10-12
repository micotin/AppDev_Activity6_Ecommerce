const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

// Route to display checkout page
router.get('/', checkoutController.getCheckoutPage);

// Route to process checkout form submission
router.post('/', checkoutController.processCheckout);

module.exports = router;

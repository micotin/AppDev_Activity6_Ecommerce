const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Render dashboard view
router.get('/dashboard', adminController.getDashboard);

// Routes for products CRUD
router.get('/products', adminController.getProducts);
router.get('/products/add', adminController.getAddProduct); // Render the add product form
router.post('/products/add', adminController.postAddProduct); // Handle form submission for adding a product
router.get('/products/edit/:id', adminController.getEditProduct); // Render the edit product form
router.post('/products/edit/:id', adminController.postEditProduct); // Handle form submission for editing a product
router.post('/products/delete/:id', adminController.deleteProduct); // Handle deleting a product

router.get('/orders', adminController.getOrders); // Ensure this line is present
router.post('/orders/delete/:id', adminController.deleteOrder); // Ensure this line is present


module.exports = router;

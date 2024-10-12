const db = require('../config/dbConfig'); // Adjust the path to your database configuration

exports.getCheckoutPage = (req, res) => {
    if (!req.session.cart || req.session.cart.length === 0) {
        return res.redirect('/cart');
    }
    res.render('checkout', { title: 'Checkout' });
};

exports.processCheckout = (req, res) => {
    const { name, email, address, paymentMethod } = req.body;

    // Validate incoming data
    if (!name || !email || !address || !paymentMethod) {
        console.error('Missing required fields');
        return res.status(400).send('Missing required fields');
    }

    // Log the received data for debugging
    console.log('Checkout data received:', req.body);

    // Query to insert order details into your orders table
    const query = 'INSERT INTO orders (name, email, address, payment_method) VALUES (?, ?, ?, ?)';
    
    db.query(query, [name, email, address, paymentMethod], (err, result) => {
        if (err) {
            console.error('Error saving order:', err); // Log error
            return res.status(500).send('Error saving order');
        }
        // Clear the cart after processing the order
        req.session.cart = [];

        // Render confirmation page
        res.render('confirmation', { title: 'Order Confirmation', orderId: result.insertId }); // Sending the order ID for confirmation
    });
};

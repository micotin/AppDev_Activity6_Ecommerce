const db = require('../config/dbConfig');

// Render landing page
exports.renderLandingPage = (req, res) => {
    res.render('index', { title: 'Welcome to Sam1 E-commerce' });
};

// Render home page with products
exports.renderHomePage = async (req, res) => {
    if (req.session.user) {
        try {
            // Fetch products from the database
            const [products] = await db.promise().query('SELECT * FROM products');

            // Convert product prices to numbers (in case they are stored as strings)
            products.forEach(product => {
                product.price = parseFloat(product.price); // Ensure price is a number
            });

            // Render home.ejs with products
            res.render('home', { title: 'Home', products });
        } catch (error) {
            console.error('Error fetching products:', error);
            res.status(500).send('An error occurred while fetching products.');
        }
    } else {
        res.redirect('/login');
    }
};

// homeController.js
const db = require('../config/dbConfig');

exports.getHomePage = (req, res) => {
  // Fetch products from the database
  const productsQuery = 'SELECT * FROM products LIMIT 6'; // Fetch 6 featured products

  db.query(productsQuery, (err, products) => {
    if (err) {
      console.error('Error fetching products:', err);
      res.status(500).send('Error fetching products');
      return;
    }

    // Parse the price for each product if needed
    products.forEach(product => {
      product.price = product.price ? parseFloat(product.price) : 0;
    });

    // Render the home page with products
    res.render('home', {
      title: 'Welcome to Sam1 Flower Shop',
      products // Passing the products array to the view
    });
  });
};

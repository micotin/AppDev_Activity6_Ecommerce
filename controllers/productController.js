const db = require('../config/dbConfig');

exports.getAllProducts = (req, res) => {
  const page = parseInt(req.query.page) || 1; // Get current page from query or default to 1
  const limit = 6; // Number of products to display per page
  const offset = (page - 1) * limit; // Calculate the offset

  const countQuery = 'SELECT COUNT(*) as total FROM products';
  const productsQuery = 'SELECT * FROM products LIMIT ? OFFSET ?';

  // First query to count total products
  db.query(countQuery, (err, countResult) => {
    if (err) {
      console.error('Error counting products:', err);
      return res.status(500).send('Error counting products');
    }

    const totalProducts = countResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit); // Calculate total pages

    // Second query to fetch products with pagination
    db.query(productsQuery, [limit, offset], (err, products) => {
      if (err) {
        console.error('Error fetching products:', err);
        return res.status(500).send('Error fetching products');
      }

      // Process each product (e.g., adjust price format and log image URL)
      products.forEach(product => {
        product.price = product.price ? parseFloat(product.price) : 0; // Ensure price is a float
        console.log(`Product ID: ${product.id}, Image URL: ${product.image_url}`); // Debugging image URL
      });

      // Render the products page with pagination
      res.render('products', {
        title: 'Our Products',
        products, // The products to display
        currentPage: page, // Current page number
        totalPages, // Total number of pages
        hasNextPage: page < totalPages, // Show "next" if more pages
        hasPreviousPage: page > 1, // Show "previous" if not on the first page
        nextPage: page + 1, // Next page number
        previousPage: page - 1, // Previous page number
        lastPage: totalPages // Last page number
      });
    });
  });
};

exports.getProductById = (req, res) => {
  const productId = req.params.id; // Get product ID from URL

  const productQuery = 'SELECT * FROM products WHERE id = ?';
  
  // Query to fetch product by ID
  db.query(productQuery, [productId], (err, productResult) => {
    if (err) {
      console.error('Error fetching product by ID:', err);
      return res.status(500).send('Error fetching product');
    }

    if (productResult.length === 0) {
      // No product found with the given ID
      return res.status(404).send('Product not found');
    }

    const product = productResult[0];
    product.price = product.price ? parseFloat(product.price) : 0; // Ensure price is a float

    // Render the product details page
    res.render('product', {
      title: product.name,
      product // Send product data to the view
    });
  });
};

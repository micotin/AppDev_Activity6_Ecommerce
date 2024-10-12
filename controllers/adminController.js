const db = require('../config/dbConfig');
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads'); // Define the upload folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname); // Save with a unique name
    }
});

// Initialize multer for single file upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // 1MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: Images Only!');
    }
}).single('image');

// Dashboard view
exports.getDashboard = (req, res) => {
    const query = 'SELECT COUNT(*) AS totalProducts FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching product count:', err);
            return res.status(500).send('Error fetching product count');
        }
        const totalProducts = results[0].totalProducts;
        res.render('admin/dashboard', { title: 'Admin Dashboard', totalProducts });
    });
};

// Fetch and display products
exports.getProducts = (req, res) => {
    const query = 'SELECT * FROM products';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching products:', err);
            return res.status(500).send('Error fetching products');
        }

        // Convert price to a number if it is a string
        results.forEach(product => {
            product.price = parseFloat(product.price); // Convert price to float
        });

        res.render('admin/products', { title: 'Admin - Products', products: results });
    });
};

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', { title: 'Admin - Add Product' });
};

// Handle product submission
exports.postAddProduct = (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).send('Error uploading file');
        }

        const { name, description, price } = req.body;
        const imagePath = req.file.path; // Path to the uploaded image
        const query = 'INSERT INTO products (name, description, price, image_url) VALUES (?, ?, ?, ?)';
        db.query(query, [name, description, price, imagePath], (err) => {
            if (err) {
                console.error('Error adding product:', err);
                return res.status(500).send('Error adding product');
            }
            res.redirect('/admin/products');
        });
    });
};

// Render the edit-product page
exports.getEditProduct = (req, res) => {
    const productId = req.params.id;
    const query = 'SELECT * FROM products WHERE id = ?';
    db.query(query, [productId], (err, results) => {
        if (err) {
            console.error('Error fetching product:', err);
            return res.status(500).send('Error fetching product');
        }
        if (results.length === 0) {
            return res.status(404).send('Product not found');
        }
        res.render('admin/edit-product', {
            title: 'Admin - Edit Product',
            product: results[0],
            message: null // Initialize message variable
        });
    });
};

// Handle product edit submission
exports.postEditProduct = (req, res) => {
    const productId = req.params.id;
    upload(req, res, (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).send('Error uploading file');
        }

        const { name, description, price } = req.body;
        const imagePath = req.file ? req.file.path : req.body.existingImage; // Use existing image if no new file is uploaded
        const query = 'UPDATE products SET name = ?, description = ?, price = ?, image_url = ? WHERE id = ?';
        db.query(query, [name, description, price, imagePath, productId], (err) => {
            if (err) {
                console.error('Error updating product:', err);
                return res.status(500).send('Error updating product');
            }
            res.redirect('/admin/products');
        });
    });
};

// Handle product deletion
exports.deleteProduct = (req, res) => {
    const productId = req.params.id;
    const query = 'DELETE FROM products WHERE id = ?';
    db.query(query, [productId], (err) => {
        if (err) {
            console.error('Error deleting product:', err);
            return res.status(500).send('Error deleting product');
        }
        res.redirect('/admin/products');
    });
};

// Fetch and display orders
exports.getOrders = (req, res) => {
    const query = 'SELECT * FROM orders'; 
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching orders:', err);
            return res.status(500).send('Error fetching orders');
        }
        res.render('admin/orders', { title: 'Admin - Orders', orders: results });
    });
};

exports.deleteOrder = (req, res) => {
    const orderId = req.params.id;
    
    // Logic to delete order from the database
    db.query('DELETE FROM orders WHERE id = ?', [orderId], (error, results) => {
        if (error) {
            console.error('Error deleting order:', error);
            return res.status(500).send('Internal Server Error');
        }
        res.redirect('/admin/orders'); // Redirect after deletion
    });
};
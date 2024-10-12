const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const session = require('express-session');
const db = require('./config/dbConfig');
const multer = require('multer');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.json()); // Parse JSON bodies

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',  // Use an environment variable for security
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }  // Set to true when using HTTPS
}));

// Set view engine
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.set('views', path.join(__dirname, 'views')); // Set the views directory

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
const upload = multer({ storage: storage }); // Initialize multer with the storage configuration

// Routes
const indexRoutes = require('./routes/index');
const homeRoutes = require('./routes/home');
const productRoutes = require('./routes/products');
const galleryRoutes = require('./routes/gallery');
const reviewRoutes = require('./routes/reviews');
const contactRoutes = require('./routes/contact');
const aboutRoutes = require('./routes/about');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const searchRoutes = require('./routes/search');
const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/authRoutes.js'); // Include auth routes

// Use routes
app.use('/', indexRoutes);
app.use('/home', homeRoutes);
app.use('/products', productRoutes);
app.use('/gallery', galleryRoutes);
app.use('/reviews', reviewRoutes);
app.use('/contact', contactRoutes);
app.use('/about', aboutRoutes);
app.use('/cart', cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/search', searchRoutes);
app.use('/admin', adminRoutes);
app.use('/auth', authRoutes); // Use auth routes

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error stack trace for debugging
  res.status(500).send('Something broke!'); // Send generic error response
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log server start message
});

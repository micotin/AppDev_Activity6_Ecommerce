const db = require('../config/dbConfig');

exports.getCart = (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }

  const productIds = req.session.cart.map(item => item.id);

  if (productIds.length === 0) {
    return res.render('cart', { title: 'Your Cart', cartItems: [], total: 0 });
  }

  // Query to fetch product details from the products table
  const query = 'SELECT * FROM products WHERE id IN (?)';
  db.query(query, [productIds], (err, results) => {
    if (err) {
      console.error('Error fetching cart items:', err);
      res.status(500).send('Error fetching cart items');
      return;
    }

    // Ensure that the price is a float and not undefined or null
    const cartItems = results.map(product => {
      const cartItem = req.session.cart.find(item => item.id === product.id);
      return {
        ...product,
        price: parseFloat(product.price), // Convert the price to a number
        quantity: cartItem.quantity
      };
    });

    // Calculate the total cart price
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    res.render('cart', { title: 'Your Cart', cartItems, total });
  });
};


// const cartItems = results.map(product => {
//   const cartItem = req.session.cart.find(item => item.id === product.id);
//   return {
//       ...product,
//       price: parseFloat(product.price), // Ensure price is a number
//       quantity: cartItem.quantity
//   };
// });


exports.addToCart = (req, res) => {
  const { productId, quantity } = req.body;

  if (!req.session.cart) {
      req.session.cart = [];
  }

  const existingItem = req.session.cart.find(item => item.id === parseInt(productId));

  if (existingItem) {
      existingItem.quantity += parseInt(quantity);
  } else {
      req.session.cart.push({ id: parseInt(productId), quantity: parseInt(quantity) });
  }

  res.redirect('/cart');
};


exports.removeFromCart = (req, res) => {
  const { productId } = req.body;
  
  if (req.session.cart) {
    req.session.cart = req.session.cart.filter(item => item.id !== parseInt(productId));
  }

  res.redirect('/cart');
};

exports.updateCart = (req, res) => {
  const { productId, quantity } = req.body;
  
  if (req.session.cart) {
    const item = req.session.cart.find(item => item.id === parseInt(productId));
    if (item) {
      item.quantity = parseInt(quantity);
    }
  }

  res.redirect('/cart');
};
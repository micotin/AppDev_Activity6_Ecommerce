const db = require('../config/dbConfig');

exports.searchProducts = (req, res) => {
  const { query } = req.query;
  const searchQuery = `%${query}%`;

  const sql = 'SELECT * FROM products WHERE name LIKE ? OR description LIKE ?';
  db.query(sql, [searchQuery, searchQuery], (err, results) => {
    if (err) {
      console.error('Error searching products:', err);
      res.status(500).send('Error searching products');
      return;
    }
    res.render('search-results', { title: 'Search Results', products: results, query });
  });
};
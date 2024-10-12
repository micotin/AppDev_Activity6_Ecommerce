const db = require('../config/dbConfig');

exports.getAllReviews = (req, res) => {
  const query = 'SELECT * FROM reviews ORDER BY created_at DESC';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching reviews:', err);
      res.status(500).send('Error fetching reviews');
      return;
    }
    res.render('reviews', { title: 'Customer Reviews', reviews: results });
  });
};

exports.addReview = (req, res) => {
  const { name, rating, comment } = req.body;
  const query = 'INSERT INTO reviews (name, rating, comment) VALUES (?, ?, ?)';
  db.query(query, [name, rating, comment], (err, result) => {
    if (err) {
      console.error('Error adding review:', err);
      res.status(500).send('Error adding review');
      return;
    }
    res.redirect('/reviews');
  });
};
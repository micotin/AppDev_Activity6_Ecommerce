// models/admin.js
const db = require('../util/database'); // Replace with your database connection

exports.findByEmail = (email) => {
  return db.execute('SELECT * FROM admins WHERE email = ?', [email]);
};

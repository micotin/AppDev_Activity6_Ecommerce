// createAdmin.js

const bcrypt = require('bcrypt');
const db = require('./config/dbConfig'); // Adjust the path as necessary

const createAdmin = async () => {
    const hashedPassword = await bcrypt.hash('walangpassword', 10);
    db.query('INSERT INTO admin (username, password) VALUES (?, ?)', ['admin', hashedPassword], (error, results) => {
        if (error) {
            console.error('Error creating admin:', error);
        } else {
            console.log('Admin created successfully:', results);
        }
    });
};

createAdmin();

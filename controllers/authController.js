const bcrypt = require('bcrypt');
const db = require('../config/dbConfig');

// Render signup page
exports.renderSignupPage = (req, res) => {
    res.render('index', { title: 'Sign Up' });
};

// Handle signup logic
exports.signup = async (req, res) => {
    const { name, username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.redirect('/auth/signup');
    }

    try {
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Insert user into database
        const sql = `INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)`;
        await db.promise().query(sql, [name, username, email, hashedPassword]);

        // Redirect to login page after successful signup
        res.redirect('/auth/login');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};

// Render login page
exports.renderLoginPage = (req, res) => {
    res.render('index', { title: 'Login' });
};

// Handle login logic
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user in the database
        const [rows] = await db.promise().query(`SELECT * FROM users WHERE email = ? OR username = ?`, [email, email]);
        const user = rows[0];

        if (!user) {
            return res.redirect('/auth/login');
        }

        // Compare password with hashed password
        const validPassword = await bcrypt.compare(password, user.password);

        if (validPassword) {
            // Set session and redirect based on role
            req.session.user = user;

            // Assuming `role` field exists to distinguish user/admin
            if (user.role === 'admin') {
                res.redirect('/admin');
            } else {
                res.redirect('/home');
            }
        } else {
            res.redirect('/auth/login');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
};



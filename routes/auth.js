const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const passport = require('../config/googleAuth');
const router = express.Router();
const User= require('../models/user.model');
const jwt= require('jsonwebtoken');
require('dotenv').config();

router.post('/register', register);
router.post('/login', login);

// Google Authentication Route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google Callback Route
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), async (req, res) => {
    try {
        // Generate a token for the authenticated user
        const token = jwt.sign(
            { id: req.user._id, role: req.user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
        res.redirect(`/api/auth/profile?token=${token}`);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/profile', async (req, res) => {
    const token = req.query.token;

    if (!token) {
        return res.redirect('/api/auth/google');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.send(`
            <h1>Hello ${user.name}</h1>
            <img src="${user.photo}" alt="Profile Photo" style="width: 150px; height: 150px; object-fit: cover;" /><br>
            <p>Email: ${user.email}</p>
            <p>Token: ${token}</p>
            <a href="/api/auth/logout">Logout</a>
        `);
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: 'Invalid or expired token' });
    }
});

// Logout Route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;

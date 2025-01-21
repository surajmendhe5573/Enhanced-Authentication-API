const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const passport = require('../config/googleAuth');
const router = express.Router();
const User= require('../models/user.model');

router.post('/register', register);
router.post('/login', login);

// Google Authentication Route
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

// Google Callback Route
router.get('/google/callback', passport.authenticate('google', {
    failureRedirect: '/login'
}), (req, res) => {
    res.redirect('/api/auth/profile');
});

// // Profile Route
// router.get('/profile', (req, res) => {
//     if (!req.isAuthenticated()) {
//         return res.redirect('/api/auth/google');
//     }
//     res.send(`<h1>Hello ${req.user.displayName}</h1><a href="/api/auth/logout">Logout</a>`);
// });

// Profile Route
router.get('/profile', async (req, res) => {
  if (!req.isAuthenticated()) {
      return res.redirect('/api/auth/google');
  }

  // Fetch user data from database
  const user = await User.findById(req.user.id);
  res.send(`<h1>Hello ${user.name}</h1><img src="${user.photo}" alt="Profile Photo" /><br><a href="/api/auth/logout">Logout</a>`);
});

// Logout Route
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

module.exports = router;

const express= require('express');
const router= express.Router();
const { fetchProfile } = require('../controllers/profile.controller');
const authenticate= require('../middlewares/auth.middleware');

router.get('/me', authenticate, fetchProfile);


module.exports= router;
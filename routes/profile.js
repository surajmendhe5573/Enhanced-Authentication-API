const express= require('express');
const router= express.Router();
const { fetchProfile, updateProfile, uploadProfilePhoto, updateProfileVisibility } = require('../controllers/profile.controller');
const authenticate= require('../middlewares/auth.middleware');
const upload= require('../config/upload');

router.get('/me', authenticate, fetchProfile);
router.put('/me', authenticate, upload.single('photo'), updateProfile); 
router.post('/me/photo', authenticate, upload.single('photo'), uploadProfilePhoto); 
router.patch('/me/visibility', authenticate, updateProfileVisibility);


module.exports= router;
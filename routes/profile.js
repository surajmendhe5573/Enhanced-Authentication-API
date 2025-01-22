const express= require('express');
const router= express.Router();
const { fetchProfile, updateProfile, uploadProfilePhoto, updateProfileVisibility, viewAllProfilesForAdmin, listPublicProfiles } = require('../controllers/profile.controller');
const authenticate= require('../middlewares/auth.middleware');
const upload= require('../config/upload');

router.get('/me', authenticate, fetchProfile);
router.put('/me', authenticate, upload.single('photo'), updateProfile); 
router.post('/me/photo', authenticate, upload.single('photo'), uploadProfilePhoto); 
router.patch('/me/visibility', authenticate, updateProfileVisibility);
router.get('/users', listPublicProfiles);
router.get('/admin/profiles', authenticate, viewAllProfilesForAdmin); 


module.exports= router;
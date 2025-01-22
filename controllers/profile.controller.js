const User= require('../models/user.model');
const bcrypt= require('bcrypt');

const fetchProfile= async(req, res)=>{
    try {
        const user = await User.findById(req.user.id); 

        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({message: 'User fetched successfully', user});
        
    } catch (error) {
        res.status(500).json({message: 'Internaal server error'});
    }
}

const updateProfile = async (req, res) => {
    try {
        const { name, email, password, bio, phone } = req.body;

        const userId = req.user.id;
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const updates = {};

        if (name) updates.name = name;
        if (bio) updates.bio = bio;
        if (phone) updates.phone = phone;

        if (email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== userId) {
                return res.status(409).json({ message: 'Email is already taken by another user' });
            }
            updates.email = email;
        }

        if (password) {
            updates.password = await bcrypt.hash(password, 10);
        }

        if (req.file) {
            updates.photo = `/uploads/${req.file.filename}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({message: 'User updated successfully.', user: updatedUser});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
};

const uploadProfilePhoto = async (req, res) => {
    try {
        const userId = req.user.id; 
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const updates = {};

        if (req.file) {
            updates.photo = `/uploads/${req.file.filename}`;
        }

        if (req.body.photoUrl) {
            updates.photo = req.body.photoUrl;
        }

        if (!updates.photo) {
            return res.status(400).json({ message: 'No photo or URL provided' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updates },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Profile photo updated successfully.',
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
};

const updateProfileVisibility = async (req, res) => {
    try {
        const userId = req.user.id; 
        if (!userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const { visibility } = req.body;

        if (typeof visibility !== 'boolean') {
            return res.status(400).json({ message: 'Invalid visibility value. Must be true or false.' });
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: { visibility } },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({
            message: 'Profile visibility updated successfully.',
            user: updatedUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
};

const viewAllProfilesForAdmin = async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ message: 'Access denied. Admins only.' });
        }

        const users = await User.find();

        return res.status(200).json({
            message: 'All user profiles fetched successfully.',
            users,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred.', error: error.message });
    }
};

const listPublicProfiles = async (req, res) => {
    try {
        const users = await User.find({ visibility: true }).select('-password'); 

        if (users.length === 0) {
            return res.status(404).json({ message: 'No public profiles found.' });
        }

        return res.status(200).json({ message: 'Public profiles retrieved successfully.',users});
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'An error occurred while fetching profiles.', error: error.message });
    }
};

const deleteUser= async(req, res)=>{
    try {
        const userId= req.user.id;
        if(!userId){
            res.status(401).json({message: 'Authentication required to delete your account'});    // You must be logged in to delete your account
        }

        const deleteUser= await User.findByIdAndDelete(userId);
        if(!deleteUser){
            return res.status(404).json({message: 'User not found'});
        }

        res.status(200).json({message: 'User deleted successfully'});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Internal server error'});
    }
}

module.exports= { fetchProfile, updateProfile, uploadProfilePhoto, updateProfileVisibility, viewAllProfilesForAdmin, listPublicProfiles, deleteUser };
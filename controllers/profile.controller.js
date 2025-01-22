const User= require('../models/user.model');
const bcrypt= require('bcrypt');

const fetchProfile= async(req, res)=>{
    try {
        const user = await User.findById(req.user.id); // Get user by ID stored in session

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

        // Authorization check
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



module.exports= { fetchProfile, updateProfile, uploadProfilePhoto };
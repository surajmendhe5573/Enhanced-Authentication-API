const User= require('../models/user.model');

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

module.exports= { fetchProfile };
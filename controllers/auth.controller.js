const User= require('../models/user.model');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');
require('dotenv').config();

const register= async(req, res)=>{
    try {
        const {name, email, password}= req.body;
        
        if(!name || !email || !password){
            return res.status(400).json({message: 'All fields are required'});
        }

        const userExist= await User.findOne({email});
        if(userExist){
            return res.status(409).json({messagee: 'User already exist'});
        }

        const hashedPassword= await bcrypt.hash(password, 10);
        
        const newUser= new User({
            name, 
            email,
            password: hashedPassword
        });

        await newUser.save();
        res.status(201).json({message: 'User created successfully', user:newUser});
        
    } catch (error) {
        res.status(500).json({message: 'Internal server error'});
    }
}

const login= async(req, res)=>{
    try {
        const {email, password}= req.body;

        if(!email || !password){
            return res.status(400).json({message: 'Email and Password are required'});
        }

        const userExist= await User.findOne({email});
        if(!userExist){
            return res.status(401).json({message: 'Inavalid credentials'});
        }

        const isMatch= await bcrypt.compare(password, userExist.password);
        if(!isMatch){
            return res.status(401).json({message: 'Invalid credentials'});
        }

        const token= jwt.sign({id: userExist._id}, process.env.JWT_SECRET, {expiresIn: '1h'});

        res.status(200).json({message: 'User logged in successfully', token});
        
    } catch (error) {
        res.status(500).json({message: 'Internaal server error'});
    }
}


module.exports= {register, login};
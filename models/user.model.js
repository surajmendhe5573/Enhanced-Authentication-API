const mongoose= require('mongoose');

const userSchema= new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    bio: {
        type: String,
        default: ''
    },
    phone: {
        type: String,
        default: ''
    },
    photo: {
        type: String,
        default: ''
    },
    visibility: {
        type: Boolean,
        default: true   // true = public, false = private
    },
    role: {
        type: String,
        enum: ['User', 'Admin']
    },
}, {timestamps:true});


module.exports= mongoose.model('User', userSchema);
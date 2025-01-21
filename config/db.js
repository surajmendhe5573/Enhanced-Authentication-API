const mongoose= require('mongoose');
require('dotenv').config();

const connectDB= ()=>{
    mongoose.connect(process.env.MONGO_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true
    }).then(()=>{
        console.log('Database connected'); 
    }).catch((err)=>{
        console.log(err);
    })
}

connectDB();

module.exports= connectDB;
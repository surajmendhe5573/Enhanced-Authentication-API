const express= require('express');
const app= express();
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const path= require('path');

const port= process.env.PORT || 5000

app.use(express.json());

require('./config/db');
require('./config/googleAuth');

app.use(session({
    secret: process.env.SESSION_SECRET, 
    resave: false,
    saveUninitialized: true,
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/profile', require('./routes/profile'));

app.get('/', (req, res) => {
    res.send(`<h1>Welcome</h1><a href="/api/auth/google">Sign In with Google</a>`);
  });

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
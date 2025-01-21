const express= require('express');
const app= express();
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');

const port= process.env.PORT || 5000

app.use(express.json());

require('./config/db');
require('./config/googleAuth');

// Use session for authentication
app.use(session({
    secret: process.env.SESSION_SECRET,  // Store session secret in .env
    resave: false,
    saveUninitialized: true,
  }));

app.use(passport.initialize());
app.use(passport.session());

app.use('/api/auth', require('./routes/auth'));

app.get('/', (req, res) => {
    res.send(`<h1>Welcome</h1><a href="/api/auth/google">Sign In with Google</a>`);
  });

app.listen(port, ()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
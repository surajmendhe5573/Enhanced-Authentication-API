const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticate = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;  

        // Ensure that the role exists
        if (!req.user.role) {
            return res.status(400).json({ message: 'Invalid token: missing role' });
        }
        next();  
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};


module.exports = authenticate;

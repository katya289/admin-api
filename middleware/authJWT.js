const jwt = require('jsonwebtoken');
const User = require('../models/User');

const verifyToken = (req, res, next) => {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {

        const token = req.headers.authorization.split(' ')[1];
        
        jwt.verify(token, process.env.API_SECRET, async (err, decoded) => {
            if (err) {
               
                return res.status(401).json({ error: 'Invalid token' });
            }
            try {
                const user = await User.findByPk(decoded.id);
                if (!user) {
                    return res.status(401).json({ error: 'User not found' });
                }
                req.user = user; 
                next();
            } catch (error) {
                console.error('Error finding user:', error);
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    } else {
        return res.status(401).json({ error: 'Authorization header missing or invalid' });
    }
};

module.exports = verifyToken;

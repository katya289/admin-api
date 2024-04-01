
var jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const User = require('../models/User');


exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User with this email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (isPasswordValid) {
            const token = jwt.sign({ id: user.id }, process.env.API_SECRET, {
                expiresIn: 86400
            });
            return res.status(200).send({
                user: {
                    id: user.id,
                    email: user.email
                },
                message: 'Logged in successfully',
                accessToken: token
            });
        } else {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error authorizing user:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}





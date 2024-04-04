const multer = require("multer");
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const storage = multer.memoryStorage(); 
const upload = multer({ storage: storage }).single('avatar'); 
exports.registerUser = async (req, res) => {
    try {
        
        upload(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ error: 'Error uploading avatar' });
            }

            const { name, email, password } = req.body;
            const avatar = req.file.originalname;
            console.log(avatar)
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(400).json({ error: 'User with this email already exists' });
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = await User.create({ name, email, password: hashedPassword, avatar });
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        });
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

exports.getAuthorizedUser = async(req, res) => {
    try {
        if(!req.user)
        {
            return res.status(401).json({ error: 'User not found' });

        }
        return res.status(200).send({message: 'Successfully fetched authorized user info', user: req.user})
    }
    catch(error)
    {
        return res.status(500).json({ error: 'Internal server error' });
    }
    
}



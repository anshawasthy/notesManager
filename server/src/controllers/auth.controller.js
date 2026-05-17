const authModel = require('../models/auth.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) =>  {
    const { username, email, password } = req.body;
    
    try {
        const existingUser = await authModel.findOne({ 
            $or: [{ email }, { username }]
         });
         if (existingUser) {
            return res.status(400).json({ message: 'User with this email or username already exists' });
        }
       const hashedPassword = await bcrypt.hash(password, 10); 
       const user = await authModel.create({
           username,
           email,
           password: hashedPassword
       });
       const token = jwt.sign(
           {id: user._id},
           process.env.JWT_SECRET,
       );
    res.cookie('token', token);
    res.status(201).json({ message: 'User registered successfully', user: { username, email }, token });
    } catch (err) {
        console.error('Error registering user:', err);
        return res.status(500).json({ message: 'Server error' });
    }


};

const loginUser = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user = await authModel.findOne({ 
            $or: [{ email }, { username }]
         });
         if (!user) {
            return res.status(400).json({ message: 'User not found, Please Register' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const token = jwt.sign(
            {id: user._id},
            process.env.JWT_SECRET,
        );
     res.cookie('token', token);
     res.status(200).json({ message: 'User logged in successfully', user: { username: user.username, email: user.email }, token });
    } catch (err) {
        console.error('Error logging in user:', err);
        return res.status(500).json({ message: 'Server error' });
    }

};

module.exports = {
    registerUser,
    loginUser
};
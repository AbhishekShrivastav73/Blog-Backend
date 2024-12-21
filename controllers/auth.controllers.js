const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

module.exports.signup = async function(req, res) {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).send('Please provide all fields');
        }
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token, newUser });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong in the signup process');
    }
}

module.exports.login = async function(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).send('Please provide all fields');
        }
        const existingUser = await User.findOne({ email });
        if (!existingUser) {
            return res.status(404).send('User does not exist');
        }
        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordCorrect) {
            return res.status(400).send('Invalid credentials');
        }
        const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token, user: existingUser });
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong in the login process');
    }
}

module.exports.logout = async function(req, res) {
    try {
        res.clearCookie('token');
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Something went wrong in the logout process' });
    }
}
module.exports.getProfile = async function(req, res) {
    try {
        const user = await User.findOne({ _id: req.user.id }).populate('posts');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('Something went wrong in the get profile process');
    }
}


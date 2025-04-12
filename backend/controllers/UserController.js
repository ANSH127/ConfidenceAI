const UserModel = require('../models/UserModel');
const jwt = require('jsonwebtoken')


const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.JWT_SECRET, { expiresIn: '3d' });
}

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const user = await UserModel.signup(name, email, password);
        const token = createToken(user._id);
        res.status(200).json({ name, email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await UserModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 3 * 24 * 60 * 60 * 1000 });
        res.status(200).json({ email, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

module.exports = {
    signup,
    login
}
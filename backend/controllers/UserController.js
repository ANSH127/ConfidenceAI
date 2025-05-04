const UserModel = require('../models/UserModel');
const ChatModel = require('../models/ChatModel');
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

const getUserScore = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = user._id;
    
    try {
        const chats = await ChatModel.find({ userId, isCompleted: true }).sort({ createdAt: -1 });
        if (!chats) {
            return res.status(404).json({ error: 'No completed chats found' });
        }
        const obj = {
            vocubulary: 0,
            content: 0,
            confidence: 0,
            clarity: 0,
        }

        chats.forEach(chat => {
            obj.vocubulary += chat.score.vocubulary;
            obj.content += chat.score.content;
            obj.confidence += chat.score.confidence;
            obj.clarity += chat.score.clarity;
        });
        obj.vocubulary = obj.vocubulary / chats.length;
        obj.content = obj.content / chats.length;
        obj.confidence = obj.confidence / chats.length;
        obj.clarity = obj.clarity / chats.length;
        res.status(200).json(obj);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


module.exports = {
    signup,
    login,
    getUserScore,
}
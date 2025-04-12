const ChatModel = require('../models/ChatModel');
const { v4: uuidv4 } = require('uuid');

const createChat = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    // genrate a random chatId
    const chatId = uuidv4();
    const userId = user._id;

    // create a new chat

    const existingChat = await ChatModel.findOne({ userId, chatId });
    if (existingChat) {
        return res.status(400).json({ error: 'Chat already exists' });
    }
    // create a new chat
    try {
        const chat = await ChatModel.create({ userId, chatId });
        chat.messages.push({
            role: 'model',
            message: 'Type "Start" to begin your mock interview!',
        });
        await chat.save();
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getChats = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = user._id;
    try {
        const chats = await ChatModel.find({ userId });
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

const getChatById = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = user._id;
    const { chatId } = req.params;
    try {
        const chat = await ChatModel.findOne({ userId, chatId });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


// add chats
const addMessage = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = user._id;
    const { chatId } = req.params;
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    try {
        const chat = await ChatModel.findOne({ userId, chatId });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        chat.messages.push(message);
        await chat.save();
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    createChat,
    getChats,
    getChatById,
    addMessage,
}
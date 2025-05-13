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
    const { selected_domain, selected_experience, selected_questionStyle } = req.body;
    if (!selected_domain || !selected_experience || !selected_questionStyle) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // create a new chat

    const existingChat = await ChatModel.findOne({ userId, chatId });
    if (existingChat) {
        return res.status(400).json({ error: 'Chat already exists' });
    }
    // create a new chat
    try {
        const chat = await ChatModel.create({ userId, chatId, selected_domain, selected_experience, selected_questionStyle });
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
        const chats = await ChatModel.find({ userId }).sort({ createdAt: -1 });
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

// delete chat by chatId
const deleteChatById = async (req, res) => {
    const { user } = req;
    if (!user) {
        return res.status(401).json({ error: 'User not authenticated' });
    }
    const userId = user._id;
    const { chatId } = req.params;
    try {
        const chat = await ChatModel.findOneAndDelete({ userId, chatId });
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

        // if messages length is greater than equal to 13 and response by model and response length greater than 50 then set iscompleted true
        if (message.role === 'model' && message.message.length > 50 && (message.message.includes("Interview Completed") || message.message.includes("Interview completed"))) {
            chat.isCompleted = true;
            findScoreAndUpdate(message,chatId);
        }

        chat.messages.push(message);
        await chat.save();
        res.status(200).json(chat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}



/*
 * Vocabulary: 5
* Content quality: 3
* Confidence: 4
* Clarity and structure of response: 2

*/

const findScoreAndUpdate = async (message,chatid) => {
    const score = message.message.match(/Vocabulary: (\d+)/);
    const contentQuality = message.message.match(/Content quality: (\d+)/);
    const confidence = message.message.match(/Confidence: (\d+)/);
    const clarity = message.message.match(/Clarity and structure of response: (\d+)/);
    const vocabulary = score ? parseInt(score[1]) : 0;
    const content = contentQuality ? parseInt(contentQuality[1]) : 0;
    const confidenceScore = confidence ? parseInt(confidence[1]) : 0;
    const clarityScore = clarity ? parseInt(clarity[1]) : 0;

    // update the chat with the score
    await ChatModel.findOneAndUpdate(
        { chatId: chatid },
        {
            $set: {
                score: {
                    vocubulary: vocabulary,
                    content: content,
                    confidence: confidenceScore,
                    clarity: clarityScore,
                },
            },
        },
        { new: true }
    );
    console.log("Score updated successfully");

}



module.exports = {
    createChat,
    getChats,
    getChatById,
    addMessage,
    deleteChatById,
}
const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    chatId: {
        type: String,
        unique: true,
        required: true,
        
    },
    messages: [
        {

            message: {
                type: String,
                required: true,
            },
            role: {
                type: String,
                enum: ['user', 'model'],
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },

});
const ChatModel = mongoose.model('Chat', chatSchema);
module.exports = ChatModel;


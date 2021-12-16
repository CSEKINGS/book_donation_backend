const mongoose = require("mongoose");

ChatSchema = new mongoose.Schema({
    chatId: {
        type: String,
        required: true,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true
    },
    userID: {
        type: String,
        required: true
    },
    time: {
        type: String,
        default: new Date().getTime(),
    },
}, {
    versionKey: false
});

const Chat = mongoose.model("Chat", ChatSchema);
module.exports = Chat;
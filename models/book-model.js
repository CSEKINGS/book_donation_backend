const mongoose = require("mongoose");

BookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    /// changed image to photo
    photo: {
        type: String,
        required: true
    },
    location: {
        type: Array,
        required: true
    },
    uploadDate: {
        type: String,
        default: new Date().toLocaleString()
    },
    userID: {
        type: String,
        required: true
    },
    // bookStatus: {
    //     type: String,
    //     default: function () { return (this.receiverID && "Donated") || "Available"; }
    // },
    // quantity: {
    //     type: Number,
    //     default: 1
    // },
    receiverID: {
        type: Object,
        default: null
    },
    receivedTimestamp: {
        type: String,
        default: function () { return this.receiverID && new Date().toLocaleString(); }
    }
}, {
    versionKey: false
});

const Book = mongoose.model("Book", BookSchema);
module.exports = Book;
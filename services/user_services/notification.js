const User = require("../../models/user-model");
const Chat = require("../../models/chat-model");

// Book request notification modification required
exports.book_notification = async (req, res, next) => {
    var user_book = {};
    const userID = req.decoded.id;
    await Chat.find({ chatId: { '$regex': userID } }, (err, chats) => {
        if (err) {
            return next(err);
        } else {
            const Chats = [...new Map(chats.map(v => [v.chatId, v])).values()];
            Chats.filter((chat) => !chat.chatId.slice(userID.length).includes(userID)).forEach((chat) => { // My chats
                user_book[chat.chatId] = { message: { ...chat._doc, bookID: chat.chatId.slice(userID.length, userID.length * 2) }, user: { _id: chat.chatId.slice(userID.length * 2) } };
            });
            Chats.filter((chat) => chat.chatId.slice(userID.length).includes(userID)).forEach((chat) => { // Other's Chats
                user_book[chat.chatId] = { message: { ...chat._doc, bookID: chat.chatId.slice(userID.length, userID.length * 2) }, user: { _id: chat.chatId.slice(0, userID.length) } };
            });
        }
    });
    for (var val in user_book) {
        const user = await User.findOne({ _id: user_book[val].user._id }, "name photo");
        user_book[val].user = user;
    }
    return res.status(200).send(user_book);
}
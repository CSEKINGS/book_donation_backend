const Chat = require("../../models/chat-model");

// Chat list
exports.book_chat = async (req, res, next) => {
    const { chatId } = req.body;
    const userID = req.decoded.id;
    if (chatId.includes(userID)) {
        Chat.find({ chatId }, (err, chats) => {
            if (err) {
                return next(err);
            } else {
                return res.status(200).send(chats)
            }
        });
    } else {
        return next({ code: 401, message: "Unauthorized" });
    }
}
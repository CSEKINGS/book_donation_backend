const User = require("../../models/user-model");
const Book = require("../../models/book-model");
const Chat = require("../../models/chat-model");

// Book donation status
exports.book_buy = (req, res, next) => {
    const { bookId, message } = req.body;
    const userID = req.decoded.id;
    Book.findOneAndUpdate({ _id: bookId, userID: { $ne: userID } }, {
        $push: { receiverID: userID }
    },
        (err, book_r) => {
            if (err) {
                return next(err);
            } else {
                Chat.create({ chatId: book_r.userID + book_r._id + userID, userID, message }, (err, chat) => {
                    if (err) {
                        return next(err);
                    } else {
                        return res.status(200).send("Book requested successfully");
                    }
                });
            }
        }
    );
}

// Book buy request cancel
exports.book_buy_cancel = (req, res, next) => {
    const { bookId, message } = req.body;
    const userID = req.decoded.id;
    Book.findOneAndUpdate({ _id: bookId, userID: { $ne: userID } }, {
        $pull: { receiverID: userID }
    },
        (err, book_r) => {
            if (err) {
                return next(err);
            } else {
                Chat.deleteMany({ chatId: book_r.userID + book_r._id + userID }, (err, chat) => {
                    if (err) {
                        return next(err);
                    } else {
                        return res.status(200).send("Book requested successfully");
                    }
                });
            }
        }
    );
}

// View book owner detail after request
exports.book_owner = (req, res, next) => {
    const { bookId } = req.body;
    const userID = req.decoded.id;
    Book.findOne({ _id: bookId, receiverID: { $in: userID } }, "-receiverID -receivedTimestamp -wishedUsers", (err, book_r) => {
        if (err) {
            return next(err);
        } else {
            if (book_r) {
                User.findOne({ _id: book_r.userID }, "-_id -password -userLog", (err, user_r) => {
                    if (err) {
                        return next(err);
                    } else {
                        return res.status(200).send({ user: user_r, book: book_r });
                    }
                });
            } else {
                return next({ code: 404, message: "Book not found" });
            }
        }
    });
}
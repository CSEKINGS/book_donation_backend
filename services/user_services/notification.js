const User = require("../../models/user-model");
const Book = require("../../models/book-model");

// Book request notification modification required
exports.book_notification = async (req, res, next) => {
    var user_book = {};
    const userID = req.decoded.id;
    await Book.find({ userID: userID }, "-location ", (err, books) => {
        if (err) {
            return next(err);
        } else {
            books.forEach((a_book) => {
                for (var k in [...new Set(a_book.receiverID)]) {
                    user_book[k] = {
                        bookID: a_book._id,
                        title: a_book.name,
                        receiver: a_book.receiverID[k],
                        requestTime: a_book.receivedTimestamp
                    };
                }
            });
        }
    });
    for (var k in user_book) {
        user_book[k]['user'] = await User.findOne({ _id: user_book[k].receiver }, "-_id -userLog -password", (user_r) => { return user_r });
    }
    return res.status(200).send(user_book);
}
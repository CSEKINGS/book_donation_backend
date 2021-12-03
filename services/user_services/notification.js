const User = require("../../models/user-model");
const Book = require("../../models/book-model");

// Book request notification modification required
exports.book_notification = async(req, res, next) => {
    var user_book = [];
    const userID = req.decoded.id;
    await Book.find({ userID: userID }, "receiverID ", (err, books) => {
        if (err) {
            return next(err);
        } else {
            books.forEach((a_book) => {
                user_book.push([...new Set(a_book.receiverID)].filter(Boolean).map((val) => ({...val, bookID: a_book._id })))
            });
            user_book = user_book.flat();
        }
    });
    for (var val in user_book) {
        const user = await User.findOne({ _id: user_book[val].userID }, "name photo");
        user_book[val] = {
            ...user_book[val],
            ...user._doc
        };
    }
    return res.status(200).send(user_book);
}
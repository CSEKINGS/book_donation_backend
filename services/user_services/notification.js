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
        }
    });
    console.log(user_book.flat());
    return res.status(200).send(user_book.flat());
}
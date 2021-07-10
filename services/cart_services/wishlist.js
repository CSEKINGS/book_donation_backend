const Book = require("../../models/book-model");

// Wishrequest
exports.wishlist_add = async (req, res, next) => {
    const { bookid } = req.body;
    const userID = req.decoded.id;
    await Book.findOneAndUpdate({ _id: bookid, userID: { $ne: userID } }, { $push: { wishedUsers: userID } }, (err, book_r) => {
        if (err) {
            return next(err);
        }
        else {
            if (book_r) {
                return res.status(200).send("Book added your wishlist successfully");
            } else {
                return next({ code: 404, message: "Book not found" });
            }
        }
    });
}


// Wishlist
exports.wishlist_view = async (req, res, next) => {
    const userID = req.decoded.id;
    await Book.find({ wishedUsers: { $in: userID } }, "_id name photo author categeory uploadDate", (err, books) => {
        if (err) {
            return next(err);
        } else {
            return res.status(200).send(books);
        }
    });
}
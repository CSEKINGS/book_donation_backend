const Book = require("../../models/book-model");

// Create book
exports.book_create = async (req, res, next) => {
    const { name, author, category, description, photo, location } = req.body;
    const userID = req.decoded.id;
    Book.create({ name, author, photo, category, description, userID, location }, async (err, book_r) => {
        if (err) {
            return next(err);
        }
        else {
            return res.status(201).send({ status: "success", message: "Book created successfully" });
        }
    });
}

// Search books
exports.book_titles = async (req, res, next) => {
    var book_titles = {}
    await Book.find({}, (err, books) => {
        if (err) {
            return next(err);
        }
        else {
            books.forEach((a_book) => {
                book_titles[a_book._id] = a_book.name;
            });
        }
    });
    return res.status(200).send(book_titles);
}

// Edit book details
exports.book_edit = (req, res, next) => {
    const { bookid, name, author, category, description, photo, location, quantity } = req.body;
    const userID = req.decoded.id;
    Book.findOneAndUpdate({ _id: bookid, userID: userID }, { $set: { name, author, photo, category, description, location, quantity } }, async (err, book_r) => {
        if (err) {
            return next(err);
        }
        else {
            if (book_r) {
                return res.status(201).send({ status: "success", message: "Book detail updated successfully" });
            } else {
                return next({ status: "Failed", message: "Book not found" });
            }
        }
    });
}

// Delete book details
exports.book_delete = (req, res, next) => {
    const { bookid } = req.body;
    const userID = req.decoded.id;
    Book.findOneAndRemove({ _id: bookid, userID: userID }, async (err, book_r) => {
        if (err) {
            return next(err);
        }
        else {
            if (book_r) {
                return res.status(201).send({ status: "success", message: "Book deleted successfully" });
            } else {
                return next({ status: "Failed", message: "Book not found" });
            }
        }
    });
}

// Books in map view
exports.book_map = async (req, res, next) => {
    var book_titles = {};
    await Book.find({}, (err, books) => {
        if (err) {
            return next(err);
        }
        else {
            books.forEach((a_book) => {
                book_titles[a_book._id] = {
                    title: a_book.name,
                    location: a_book.location
                };
            });
        }
    });
    return res.status(200).send(book_titles);
}

// Get Book detail by ID

exports.book_detail = (req, res, next) => {
    const { bookid } = req.body;
    const userID = req.decoded.id;
    Book.findOne({ _id: bookid }, async (err, book_r) => {
        if (err) {
            return next(err);
        }
        else {
            return res.status(200).send(book_r);
        }
    });
}
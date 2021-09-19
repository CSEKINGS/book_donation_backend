const Book = require("../../models/book-model");

// Create book
exports.book_create = async (req, res, next) => {
    const { name, author, category, description, photo, location, quantity } = req.body;
    const userID = req.decoded.id;
    Book.create({ name, author, photo, category, description, userID, location, quantity }, async (err, book_r) => {
        if (err) {
            return next(err);
        }
        else {
            return res.status(201).send({ status: "success", message: "Book created successfully" });
        }
    });
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
exports.book_map = (req, res, next) => {
    Book.find({}, "_id location name", (err, books) => {
        if (err) {
            return next(err);
        }
        else {
            return res.status(200).send(books);
        }
    });
}

// Search books
exports.book_titles = (req, res, next) => {
    Book.find({}, "_id name", (err, books) => {
        if (err) {
            return next(err);
        }
        else {
            return res.status(200).send(books);
        }
    });
}

// Get Book detail by ID

exports.book_detail = (req, res, next) => {
    const { bookid } = req.body;
    const userID = req.decoded.id;
    Book.findOne({ _id: bookid }, "-userID -receiverID -receivedTimestamp -wishedUsers", async (err, book_r) => {
        if (err) {
            return next(err);
        }
        else {
            return res.status(200).send(book_r);
        }
    });
}
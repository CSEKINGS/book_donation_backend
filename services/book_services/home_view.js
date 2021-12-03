const listBooks = require("./controller/listBooks");
const locationFinder = require("./controller/locationFinder");
const Book = require("../../models/book-model");
const User = require("../../models/user-model");

/**
 * HomeView 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

exports.dashboard = async(req, res, next) => {
    const userID = req.decoded.id;
    const books = await Book.find({});
    const users = await User.find({});
    return res.status(200).send({
        books: books.length,
        users: users.length,
        transaction: 5,
        notifications: [...new Set(books.map((book) => book.userID === userID && book.receiverID))].flat().filter(Boolean).length
    });

}

exports.books = async(req, res, next) => {
    const pageNo = req.params.pageNo || 1,
        coordinates = await locationFinder(req.decoded.id);
    if (coordinates.err) {
        err = coordinates.err;
        err.code = 404;
        err.message = "User Not Found"
        return next(err);
    }
    const bookTitles = await listBooks(coordinates.location, pageNo, query = '');
    if (bookTitles.err) {
        err = bookTitles.err;
        err.code = 501
        err.message = "Server Error"
        return next(err);
    }
    return res.status(200).send(bookTitles.books);

}
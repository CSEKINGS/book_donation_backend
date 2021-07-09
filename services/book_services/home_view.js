const Book = require("../../models/book-model");



module.exports = async (req, res, next) => {
    nPerPage = 10;
    const pageNo = req.params.pageNo || 1;
    var book_ids = {}
    const books = await Book.find().skip((nPerPage * (pageNo - 1))).limit(nPerPage);
    books.forEach((a_book) => {
        book_ids[a_book._id] = a_book.name;
    })
    return res.send(book_ids);
}
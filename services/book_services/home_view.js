const Book = require("../../models/book-model");

/**
 * HomeView 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

module.exports = async (req, res, next) => {
    nPerPage = 10;
    const pageNo = req.params.pageNo || 1;
    var book_ids = {}
    let books;
    try {
        Book.collection.createIndex({ location: "2dsphere" });
        books = await Book.find({
            location: {
                $near:
                {
                    $geometry: {
                        type: "Point",
                        coordinates: [74.297, 34.322]
                    },
                }
            }
        })
        .skip((nPerPage * (pageNo - 1))).limit(nPerPage);
    }
    catch (err) {
        console.log(err);
    }
    books.forEach((a_book) => {
        book_ids[a_book._id] = a_book.name;
    });
    return res.send(book_ids);
}
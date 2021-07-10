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
        }, "_id name photo author categeory uploadDate")
            .skip((nPerPage * (pageNo - 1))).limit(nPerPage);
        return res.status(200).send(books);
    }
    catch (err) {
        next(err);
    }
}
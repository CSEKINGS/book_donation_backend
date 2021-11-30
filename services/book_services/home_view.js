const listBooks = require("./controller/listBooks");
const locationFinder = require("./controller/locationFinder");
/**
 * HomeView 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

module.exports = async(req, res, next) => {
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
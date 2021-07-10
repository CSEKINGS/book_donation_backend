const listBooks = require("./controller/listBooks");
/**
 * HomeView 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */

module.exports = async (req, res, next) => {
    const pageNo = req.params.pageNo || 1
    ,coordinates = req.body.coordinates || [-23.539089, -46.790169]
    
    const bookTitles = await listBooks(coordinates,pageNo,query='');
    if(bookTitles.err){
        err = bookTitles.err;
        err.code = 501
        err.message = "Server Error"
        return next(err);
    }
    return res.status(200).send(bookTitles.books);
    
}
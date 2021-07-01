const Book = require("../../models/book-model");


exports.book_create = async (req,res,next) => {
    const {name,author,category,description,photo,location} = req.body;
    const userID = req.decoded.id;
    Book.create({ name, author,photo, category, description,userID,location},async (err,book_r) => {
        if(err){
            return next(err);
        }
        else{
            return res.status(201).send({status:"success",message:"Book Created Successfully"});
        }
    });
}

exports.book_titles = async (req,res,next) => {
    var book_titles = {}
    await Book.find({},(err,books) => {
        if(err){
            return next(err);
        }
        else{
            books.forEach((a_book) => {
                book_titles[a_book._id] = a_book.name;
            });
        }
    });
    return res.status(200).send(book_titles);
}
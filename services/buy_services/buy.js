const User = require("../../models/user-model");
const Book = require("../../models/book-model");
const Mailer = require("../mail_services/sendMail");

// Book donation status
exports.book_buy = (req, res, next) => {
    const { bookid } = req.body;
    const userID = req.decoded.id;
    Book.findOneAndUpdate({ _id: bookid, userID: { $ne: userID } }, { $set: { receiverID: userID } }, async (err, book_r) => {
        if (err) {
            return next(err);
        }
        else {
            if (book_r) {
                User.findOne({ _id: userID }, async (err, user_r) => {
                    if (err) return next(err);
                    Mailer({ email: user_r.email, subject: `${book_r.name} requested by the user ${user_r.name}`, profile: "<h1>Testing...<h1>" });
                });
                return res.status(201).send({ status: "success", message: "Book requested successfully" });
            } else {
                return next({ code: 404, message: "Book not found" });
            }
        }
    });
}

// View book owner detail after request
exports.book_owner = async (req, res, next) => {
    const { bookid } = req.body;
    const userID = req.decoded.id;
    Book.findOne({ _id: bookid, receiverID: userID }, "-receiverID -receivedTimestamp", async (err, book_r) => {
        if (err) {
            return next(err);
        }
        else {
            if (book_r) {
                User.findOne({ _id: book_r.userID }, "-_id -password -userLog", async (err, user_r) => {
                    if (err) {
                        return next(err);
                    }
                    else {
                        return res.status(200).send({ user: user_r, book: book_r });
                    }
                });
            } else {
                return next({ code: 404, message: "Book not found" });
            }
        }
    });
}

// Book request notification
exports.book_notification = async (req, res, next) => {
    var user_book = {};
    const userID = req.decoded.id;
    await Book.find({ userID: userID }, "-location ", (err, books) => {
        if (err) {
            return next(err);
        } else {
            books.forEach((a_book) => {
                // User.findOne({ _id: a_book.receiverID }, "-id -userLog -password", (err, user_r) => {
                //     if (err) return next(err);
                //     user_book[a_book._id] = {
                //         title: a_book.name,
                //         receiverName: user_r.name,
                //         email: user_r.email,
                //         mobileNo: user_r.mobileNo,
                //         requestTime: a_book.receivedTimestamp
                //     };
                // });
                user_book[a_book._id] = {
                    title: a_book.name,
                    receiver: a_book.receiverID,
                    requestTime: a_book.receivedTimestamp
                };
            });
        }
    });
    // console.log(user_book);
    return res.status(200).send(user_book);
}
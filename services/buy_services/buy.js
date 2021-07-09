const User = require("../../models/user-model");
const Book = require("../../models/book-model");
const Mailer = require("../mail_services/sendMail");

// Book donation status
exports.book_buy = async (req, res, next) => {
    const { bookid } = req.body;
    const userID = req.decoded.id;
    await Book.findOneAndUpdate({ _id: bookid, userID: { $ne: userID } }, { $push: { receiverID: userID } }, (err, book_r) => {
        if (err) {
            return next(err);
        }
        else {
            if (book_r) {
                User.findOne({ _id: userID }, async (err, user_r) => {
                    if (err) return next(err);
                    mailer = await Mailer({ email: user_r.email, subject: `${book_r.name} requested by the user ${user_r.name}`, profile: "<h1>Testing...<h1>" });
                    if (mailer.err) {
                        err = mailer.err
                        err.code = 111
                        err.message = "Connection refused or inability to open an SMTP stream"
                        return next(err);
                    }
                    else {
                        return res.status(200).send("Book requested successfully");
                    }

                });
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
    Book.findOne({ _id: bookid, receiverID: { $in: userID } }, "-receiverID -receivedTimestamp", async (err, book_r) => {
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
    var notifications = {}
    const userID = req.decoded.id;
    await Book.find({ userID: userID }, "-location ", (err, books) => {
        if (err) {
            return next(err);
        } else {
            books.forEach((a_book) => {
                for (var k in [...new Set(a_book.receiverID)]) {
                    user_book[k] = {
                        bookID: a_book._id,
                        title: a_book.name,
                        receiver: a_book.receiverID[k],
                        requestTime: a_book.receivedTimestamp
                    };
                }
            });
        }
    });
    for (var k in user_book) {
        console.log(user_book[k]);
        user_book[k]['user'] = await User.findOne({ _id:  user_book[k].receiver}, "-_id -userLog -password", (user_r) => { return user_r });
    }
    return res.status(200).send(user_book);
}
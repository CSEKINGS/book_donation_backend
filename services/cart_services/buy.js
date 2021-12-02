const User = require("../../models/user-model");
const Book = require("../../models/book-model");
const Mailer = require("../mail_services/sendMail");

// Book donation status
exports.book_buy = (req, res, next) => {
    const { bookId, message } = req.body;
    const userID = req.decoded.id;
    const time = new Date();
    Book.findOneAndUpdate({ _id: bookId, userID: { $ne: userID }, receiverID: { $ne: userID } }, {
            $push: { receiverID: { userID, message, time } }
        },
        (err, book_r) => {
            if (err) {
                return next(err);
            } else {
                if (book_r) {
                    User.findOne({ _id: book_r.userID }, async(err, user_r) => {
                        if (err) return next(err);
                        mailer = await Mailer({ email: user_r.email, subject: `${book_r.name} book requested by ${user_r.name}`, profile: `<table><tr><td><img src="${user_r.photo}" style="height:50px;width:50px;border-radius:100%"></td></tr><tr><td><h1>${user_r.name}</h1></td></tr><tr><td><h2>Book name:${book_r.name}</h2></td></tr><tr><td><h3 style="margin:1">${message}</h3></td></tr></table>` });
                        if (mailer.err) {
                            err = mailer.err
                            err.code = 111
                            err.message = "Connection refused or inability to open an SMTP stream"
                            return next(err);
                        } else {
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
exports.book_owner = (req, res, next) => {
    const { bookId } = req.body;
    const userID = req.decoded.id;
    Book.findOne({ _id: bookId, receiverID: { $in: userID } }, "-receiverID -receivedTimestamp -wishedUsers", (err, book_r) => {
        if (err) {
            return next(err);
        } else {
            if (book_r) {
                User.findOne({ _id: book_r.userID }, "-_id -password -userLog", (err, user_r) => {
                    if (err) {
                        return next(err);
                    } else {
                        return res.status(200).send({ user: user_r, book: book_r });
                    }
                });
            } else {
                return next({ code: 404, message: "Book not found" });
            }
        }
    });
}
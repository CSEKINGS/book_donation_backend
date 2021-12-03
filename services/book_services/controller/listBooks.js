const Book = require("../../../models/book-model");

/**
 * listBooks 
 * @param {Array} coordinates
 * @param {Number} pageNo
 * @param {String} query
 */

module.exports = async(coordinates, pageNo, query) => {
    nPerPage = 10;
    let books;
    try {
        Book.collection.createIndex({ location: "2dsphere" });
        books = await Book.find({
                $or: [
                    { name: { '$regex': query, '$options': 'i' } },
                    { author: { '$regex': query, '$options': 'i' } },
                    { description: { '$regex': query, '$options': 'i' } }
                ],
                location: {
                    $near: {
                        $geometry: {
                            type: "Point",
                            coordinates: coordinates
                        },
                    }
                }
            }, "_id name photo author categeory uploadDate description userID wishedUsers receiverID")
            .skip((nPerPage * (pageNo - 1))).limit(nPerPage);
        return { books }
    } catch (err) {
        return { err }
    }
}
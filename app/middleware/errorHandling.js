
module.exports = async (err, req, res, next) => {
    return res.status(err.code || 400).send({
        err: true,
        message: err.message || "Internal Server Error"
    });
}
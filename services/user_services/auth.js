const bcrypt = require("bcryptjs");

const User = require("../../models/user-model");
const isEmpty = require("../../api/validation/userValidation").isEmpty;

const { generateToken, generateRefreshToken } = require("../../api/controllers/token-controller");


exports.login = async (req, res, next) => {
    const validation = require("../../api/validation/userValidation").loginValidation(req.body);
    if (isEmpty(validation)) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next({ code: 404, message: "user not found" });
            }
            else {
                bcrypt.compare(req.body.password, user.password, async (err, isMatch) => {
                    if (err) {
                        return next(err);
                    } else if (!isMatch) {
                        return next({ code: 401, message: "Invalid Credentials" });
                    } else {
                        var token = await generateToken(user._id);
                        var refreshToken = await generateRefreshToken(user._id);
                        if (token && refreshToken) {
                            return res.send({ auth: true, message: "Logged In", token: token, refreshToken: refreshToken });
                        }
                        else {
                            return next({ code: 500, message: "Failed to generate token" });
                        }
                    }
                });
            }
        }
        catch (err) {
            return next(err);
        }
    }
    else {
        return next(validation);
    }
}



exports.register = async (req, res, next) => {
    const validation = require("../../api/validation/userValidation").registerValidation(req.body);
    if (isEmpty(validation)) {
        User.findOne({ email: req.body.email }).then((err, user) => {
            if (err) return next(err);
            if (user) {
                return next({ code: 401, message: "Email already Exist" });
            }
            else {
                const { name, email, password, mobileNo, address, about } = req.body;
                const userLog = req.connection.remoteAddress;
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                            return next(err);
                        }
                        User.create({ name: name, email: email, password: hash, mobileNo: mobileNo, address: address, about: about, userLog: { ip: userLog } }, async (err, user_r) => {
                            if (err) {
                                err.code = 500;
                                return next(err);
                            }
                            else {
                                var token = await generateToken(user_r._id);
                                var refreshToken = await generateRefreshToken(user_r._id);
                                if (token && refreshToken) {
                                    return res.status(201).send({ auth: true, message: "Logged In", token: token, refreshToken: refreshToken });
                                }
                                else {
                                    return next({ code: 500, message: "Failed to generate token" });
                                }
                            }
                        });
                    });
                });
            }
        });
    }
    else {
        return next(validation);
    }
}


// Get user detail
exports.user_detail = (req, res, next) => {
    const userID = req.decoded.id;
    User.findOne({ _id: userID }, async (err, user_r) => {
        if (err) {
            return next(err);
        }
        else {
            return res.status(200).send(user_r);
        }
    });
}


// Delete user detail
exports.user_delete = (req, res, next) => {
    const userID = req.decoded.id;
    User.findByIdAndRemove({ _id: userID }, async (err) => {
        if (err) {
            return next(err);
        }
        else {
            return res.status(201).send({ status: "success", message: "User deleted successfully" });
        }
    });
}

// Edit user details
exports.user_edit = (req, res, next) => {
    const { name, email, password, mobileNo, address, about } = req.body;
    const userLog = req.connection.remoteAddress;
    userID = req.decoded.id;
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
            if (err) {
                return next(err);
            }
            User.findByIdAndUpdate({ _id: userID }, { $set: { name: name, email: email, password: hash, mobileNo: mobileNo, address: address, about: about, userLog: { ip: userLog } } }, async (err) => {
                if (err) {
                    return next(err);
                }
                else {
                    return res.status(201).send({ status: "success", message: "User detail updated successfully" });
                }
            });
        });
    });
}
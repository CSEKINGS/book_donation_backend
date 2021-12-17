const bcrypt = require("bcryptjs");

const User = require("../../models/user-model");
const isEmpty = require("../../api/validation/userValidation").isEmpty;
const Mailer = require("../mail_services/sendMail");

const {
    generateToken,
    generateRefreshToken,
} = require("../token_services/token-controller");

//login user
exports.login = async(req, res, next) => {
    const validation =
        require("../../api/validation/userValidation").loginValidation(req.body);
    if (isEmpty(validation)) {
        try {
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return next({ code: 404, message: "user not found" });
            } else {
                if (!user.verified) {
                    var token = await generateToken({ id: user._id, mode: "VERIFICATION" });
                    const mailer = await Mailer({ email: req.body.email, subject: "Verify Email", profile: `Click here to verify your email <a href='${process.env.FRONTEND}/account/signin?token=${token}'>Click Here</a>` });
                    if (mailer.err) {
                        err = mailer.err
                        err.code = 111
                        err.message = "Connection refused or inability to open an SMTP stream"
                        return next(err);
                    }
                    return next({
                        status: 403,
                        message: "Please verify your email!",
                    });
                } else {
                    bcrypt.compare(
                        req.body.password,
                        user.password,
                        async(err, isMatch) => {
                            if (err) {
                                return next(err);
                            } else if (!isMatch) {
                                return next({ code: 401, message: "Invalid Credentials" });
                            } else {
                                var token = await generateToken(user._id);
                                var refreshToken = await generateRefreshToken(user._id);
                                if (token && refreshToken) {
                                    return res.send({
                                        auth: true,
                                        message: "Logged In",
                                        token: token,
                                        refreshToken: refreshToken,
                                    });
                                } else {
                                    return next({ code: 500, message: "Failed to generate token" });
                                }
                            }
                        }
                    );
                }
            }
        } catch (err) {
            return next(err);
        }
    } else {
        return next(validation);
    }
};

//register a new user
exports.register = async(req, res, next) => {
    const validation =
        require("../../api/validation/userValidation").registerValidation(req.body);
    if (isEmpty(validation)) {
        User.findOne({ email: req.body.email }, (err, user) => {
            if (err) return next(err);
            if (user) {
                return next({ code: 401, message: "Email already Exist" });
            } else {
                const {
                    photo,
                    name,
                    email,
                    password,
                    mobileNo,
                    address,
                    about,
                    location,
                } = req.body;
                const userLog = req.connection.remoteAddress;
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        if (err) {
                            return next(err);
                        }
                        User.create({
                                photo,
                                name,
                                email,
                                password: hash,
                                mobileNo,
                                address,
                                location,
                                about,
                                userLog: { ip: userLog },
                            },
                            async(err, user_r) => {
                                if (err) {
                                    err.code = 500;
                                    return next(err);
                                } else {
                                    var token = await generateToken({ id: user_r._id, mode: "verification" });
                                    if (token) {
                                        console.log('ok')
                                        const mailer = await Mailer({ email: email, subject: "Verify Email", profile: `Click here to verify your email <a href='${process.env.FRONTEND}/account/signin?token=${token}'>Click Here</a>` });
                                        console.log(mailer);
                                        if (mailer.err) {
                                            err = mailer.err
                                            err.code = 111
                                            err.message = "Connection refused or inability to open an SMTP stream"
                                            return next(err);
                                        } else {
                                            return res.status(200).send("User created successfully!");
                                        }
                                    } else {
                                        return next({
                                            code: 500,
                                            message: "Failed to generate token",
                                        });
                                    }
                                }
                            }
                        );
                    });
                });
            }
        });
    } else {
        return next(validation);
    }
};

//Verify Email
exports.verifyEmail = (req, res, next) => {
    const userID = req.decoded.id;
    if (userID.mode === "VERIFICATION") {
        User.findByIdAndUpdate({ _id: userID.id }, {
                $set: {
                    verified: true
                },
            },
            (err) => {
                if (err) {
                    return next(err);
                } else {
                    return res.status(201).send({
                        status: "success",
                        message: "Email verified successfully",
                    });
                }
            }
        )
    } else {
        return next({
            err: true,
            status: 403,
            message: "Verification invalid"
        })
    }
};

//forget password
exports.forget = (req, res, next) => {
    const validation =
        require("../../api/validation/userValidation").forgetValidation(req.body);
    if (isEmpty(validation)) {
        User.findOne({ email: req.body.email }, async(err, user) => {
            if (err) return next(err);
            else {
                var token = await generateToken({
                    id: user._id,
                    email: user.email,
                    mode: 'RESET_PASSWORD'
                });
                if (token) {
                    const mailer = await Mailer({ email: user.email, subject: "Password Reset", profile: `Click here to reset your password <a href='${process.env.FRONTEND}/account/reset?token=${token}'>Click Here</a>` });
                    if (mailer.err) {
                        err = mailer.err
                        err.code = 111
                        err.message = "Connection refused or inability to open an SMTP stream"
                        return next(err);
                    } else {
                        return res.status(200).send("Forget password requested successfully");
                    }
                } else {
                    return next({ code: 500, message: "Failed to generate token" });
                }
            }
        });
    } else {
        return next(validation);
    }
};

//Reset password
exports.resetPasword = async(req, res, next) => {
    const { password } = req.body;
    const userID = req.decoded.id;
    if (userID.mode === "RESET_PASSWORD") {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return next(err);
                }
                User.findByIdAndUpdate({ _id: userID.id }, {
                        $set: {
                            password: hash
                        },
                    },
                    async(err) => {
                        if (err) {
                            return next(err);
                        } else {
                            return res.status(201).send({
                                status: "success",
                                message: "Password resetted successfully",
                            });
                        }
                    }
                );
            });
        });
    } else {
        return next({
            err: true,
            status: 403,
            message: "Verification failed"
        })
    }
};

// Get user detail
exports.user_detail = (req, res, next) => {
    const userID = req.decoded.id;
    User.findOne({ _id: userID }, "-password", async(err, user_r) => {
        if (err) {
            return next(err);
        } else {
            return res.status(200).send(user_r);
        }
    });
};

// Delete user detail
exports.user_delete = (req, res, next) => {
    const userID = req.decoded.id;
    User.findByIdAndRemove({ _id: userID }, async(err) => {
        if (err) {
            return next(err);
        } else {
            return res
                .status(201)
                .send({ status: "success", message: "User deleted successfully" });
        }
    });
};

// Edit user details
exports.user_edit = (req, res, next) => {
    const { photo, name, password, mobileNo, address, about, location } = req.body;
    const userLog = req.connection.remoteAddress;
    const userID = req.decoded.id;
    User.findOne({ _id: userID }, async(err, user) => {
        if (err) {
            return next(err);
        } else {
            bcrypt.compare(
                password,
                user.password,
                async(err, isMatch) => {
                    if (err) {
                        return next(err);
                    } else if (!isMatch) {
                        return next({ code: 401, message: "Invalid Credentials" });
                    } else {
                        User.findByIdAndUpdate({ _id: userID }, {
                                $set: {
                                    photo,
                                    name,
                                    mobileNo,
                                    address,
                                    about,
                                    location,
                                    userLog: { ip: userLog },
                                },
                            },
                            async(err) => {
                                if (err) {
                                    return next(err);
                                } else {
                                    return res.status(201).send({
                                        status: "success",
                                        message: "User detail updated successfully",
                                    });
                                }
                            }
                        );
                    }
                }
            );
        }
    });
};
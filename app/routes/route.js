const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth");
const tokenController = require("../controllers/token-controller").token

//Login
router.route('/auth/login').get((req, res) => {
    res.send('Post your Login Credentials as Json');
});

router.route('/auth/login').post(controller.login);

//Register
router.route("/auth/register").get((req, res) => {
    res.send("Post your Register Credentials");
});

router.route("/auth/register").post(controller.register);

//Generate access token by refresh token
router.route("/token").post(tokenController);

module.exports = router;
const express = require("express");
const router = express.Router();

//services
const userService = require("../../services/user_services/auth");
const productService = require("../../services/product_services/dashboard");

//Token Generator
const tokenController = require("../controllers/token-controller").token;

//Token Middleware
const tokenCheker = require("../middleware/tokenCheker");

//Login
router.route('/auth/login').post(userService.login);

//Register
router.route("/auth/register").post(userService.register);

//Generate access token by refresh token
router.route("/token").post(tokenController);

//Secret access
router.route("/dashboard").get(tokenCheker,productService.dashboard);

module.exports = router;
const express = require("express");
const router = express.Router();

//services
const authentication = require("../../services/user_services/auth");
const bookCRUD = require("../../services/book_services/bookCRUD");

//Token Generator
const tokenController = require("../controllers/token-controller").token;

//Token Middleware
const tokenCheker = require("../middleware/tokenCheker");


//Routes

/* Authentication */

//Login
router.route('/auth/login').post(authentication.login);

//Register
router.route("/auth/register").post(authentication.register);

//Generate access token by refresh token
router.route("/token").post(tokenController);

/* Book Service */
router.route("/books/titles").get(tokenCheker,bookCRUD.book_titles);
router.route("/books/create").post(tokenCheker,bookCRUD.book_create);

module.exports = router;
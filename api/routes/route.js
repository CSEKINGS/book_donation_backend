const express = require("express");
const router = express.Router();

//services
const authentication = require("../../services/user_services/auth");
const bookCRUD = require("../../services/book_services/bookCRUD");
const buy=require('../../services/buy_services/buy');

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

// User detail
router.route("/user/detail").get(tokenCheker,authentication.user_detail);

// Delete user detail
router.route("/user/delete").get(tokenCheker,authentication.user_delete);


// Edit user detail
router.route("/user/edit").post(tokenCheker,authentication.user_edit);


/* Book Service */

// Search books titles
router.route("/books/titles").get(tokenCheker,bookCRUD.book_titles);

// Create book
router.route("/books/create").post(tokenCheker,bookCRUD.book_create);

// Edit book detail
router.route("/books/edit").post(tokenCheker,bookCRUD.book_edit);

// Delete books
router.route("/books/delete").post(tokenCheker,bookCRUD.book_delete);

// Book locations
router.route("/books/locations").get(tokenCheker,bookCRUD.book_map);

// Book detail
router.route("/books/detail").post(tokenCheker,bookCRUD.book_detail);


/* Collaborated services */

// Buy book
router.route("/buy/request").post(tokenCheker,buy.book_buy);

// View Book owner detail
router.route("/buy/owner").post(tokenCheker,buy.book_owner);

module.exports = router;
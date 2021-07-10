const express = require("express");
const router = express.Router();

//services
const authentication = require("../../services/user_services/auth");
const wishlist = require("../../services/user_services/wishlist");
const notification = require("../../services/user_services/notification");
const homeView_books = require("../../services/book_services/home_view");
const bookCRUD = require("../../services/book_services/bookCRUD");
const buy = require('../../services/cart_services/buy');

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
router.route("/user/detail").get(tokenCheker, authentication.user_detail);

// Delete user detail
router.route("/user/delete").get(tokenCheker, authentication.user_delete);

// Edit user detail
router.route("/user/edit").post(tokenCheker, authentication.user_edit);

// View Book request notification
router.route("/user/notification").get(tokenCheker, notification.book_notification);

// Add to wishlist
router.route("/user/wish").post(tokenCheker, wishlist.wishlist_add);

// Wishlist
router.route("/user/wishlist").get(tokenCheker, wishlist.wishlist_view);

/* Book Service */

//Homeview Request || All books with Lazy Loading
router.route("/books/all/:pageNo").get(tokenCheker, homeView_books);

// Search books titles
router.route("/books/titles").get(tokenCheker, bookCRUD.book_titles);

// Create book
router.route("/books/create").post(tokenCheker, bookCRUD.book_create);

// Edit book detail
router.route("/books/edit").post(tokenCheker, bookCRUD.book_edit);

// Delete books
router.route("/books/delete").post(tokenCheker, bookCRUD.book_delete);

// Book locations
router.route("/books/locations").get(tokenCheker, bookCRUD.book_map);

// Book detail
router.route("/books/detail").post(tokenCheker, bookCRUD.book_detail);


/* Collaborated services */

// Buy book
router.route("/buy/request").post(tokenCheker, buy.book_buy);

// View Book owner detail
router.route("/buy/owner").post(tokenCheker, buy.book_owner);

module.exports = router;
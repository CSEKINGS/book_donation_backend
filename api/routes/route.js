const express = require("express");
const router = express.Router();

//services
const authentication = require("../../services/user_services/auth");
const wishlist = require("../../services/cart_services/wishlist");
const notification = require("../../services/user_services/notification");
const homeView_books = require("../../services/book_services/home_view");
const userSearch = require("../../services/book_services/searchView");
const bookCRUD = require("../../services/book_services/bookCRUD");
const buy = require('../../services/cart_services/buy');

//Token Generator
const tokenController = require("../../services/token_services/token-controller").token;

//Token Middleware
const tokenChecker = require("../middleware/tokenChecker");


//Routes

/* Authentication */

//Login
router.route('/auth/login').post(authentication.login);

//Register
router.route("/auth/register").post(authentication.register);

//Forget
router.route("/auth/forget").post(authentication.forget);

//Reset password
router.route("/auth/reset").post(tokenChecker, authentication.resetPasword);

//Verify email
router.route("/auth/verify").get(tokenChecker, authentication.verifyEmail);

//Generate access token by refresh token
router.route("/token").get(tokenController);

// User detail
router.route("/user/detail").get(tokenChecker, authentication.user_detail);

// Delete user detail
router.route("/user/delete").delete(tokenChecker, authentication.user_delete);

// Edit user detail
router.route("/user/edit").put(tokenChecker, authentication.user_edit);

// View Book request notification
router.route("/user/notification").get(tokenChecker, notification.book_notification);

// Add to wishlist
router.route("/user/wish").post(tokenChecker, wishlist.wishlist_add);

// Add to wishlist
router.route("/user/removewish").post(tokenChecker, wishlist.wishlist_remove);

// Wishlist
router.route("/user/wishlist").get(tokenChecker, wishlist.wishlist_view);

/* Book Service */
router.route("/books/dashboard").get(tokenChecker, homeView_books.dashboard);

//Homeview Request || All books with Lazy Loading
router.route("/books/all/:pageNo").get(tokenChecker, homeView_books.books);

// Search books titles
router.route("/books/titles").get(tokenChecker, bookCRUD.book_titles);

// Search books by User query
router.route("/books/search/:pageNo").get(tokenChecker, userSearch);


// Create book
router.route("/books/create").post(tokenChecker, bookCRUD.book_create);

// Edit book detail
router.route("/books/edit").put(tokenChecker, bookCRUD.book_edit);

// Delete books
router.route("/books/delete").delete(tokenChecker, bookCRUD.book_delete);

// Book locations
router.route("/books/locations").get(tokenChecker, bookCRUD.book_map);

// Book detail
router.route("/books/detail").post(tokenChecker, bookCRUD.book_detail);


/* Collaborated services */

// Buy book
router.route("/buy/request").post(tokenChecker, buy.book_buy);

// Cancel Buy book request
router.route("/buy/cancel").post(tokenChecker, buy.book_buy_cancel);

// View Book owner detail
router.route("/buy/owner").post(tokenChecker, buy.book_owner);

module.exports = router;
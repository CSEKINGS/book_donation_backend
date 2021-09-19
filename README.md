# Book Donation Backend

## Installation

1. Clone the repository

   ```sh
   git clone https://github.com/CSEKINGS/book_donation_backend.git
   ```

2. Install NPM packages

   ```sh
   npm install
   ```

3. Rename `.env-example` to `.env` file and enter following

   ```env
   MONGODB_URI = Your mongodb connection url
   PORT = Port number
   SECRET_KEY = access token secret key 
   EXPIRES_IN = access token expiration time
   REFRESH_SECRET_KEY = Refresh token secret key
   REFRESH_LIFE = refresh token expiration time 
   MAIL_HOST = Mail Host
   MAIL_PORT = Mail Port / default 587
   MAIL_ID = Your Mail Id
   MAIL_PASS = Your Mail Password
   ```

4. Run the `app.js` file

   ```sh
   node app
   ```

5. Endpoints

   ```http
   localhost:5000/api/auth/login => to login [POST]
   localhost:5000/api/auth/register => to register[POST]
   localhost:5000/api/token => to refresh the access token[POST]
   localhost:5000/api/user/detail => to get user detail [GET]
   localhost:5000/api/user/delete => to delete user account [GET]
   localhost:5000/api/user/wish => to add book to user wishlist [POST]
   localhost:5000/api/user/wishlist => to view user wishlist [GTE]
   localhost:5000/api/user/notification => to get Any book request available [GET]
   localhost:5000/api/books/all/{number} => to get lazyloading books view [GET]
   localhost:5000/api/books/titles => to get book id and titles [GET]
   localhost:5000/api/books/create => to create new book [POST]
   localhost:5000/api/books/edit => to edit new book [POST]
   localhost:5000/api/books/delete => to delete book details [POST]
   localhost:5000/api/books/locations => to get book name, id and location [GET]
   localhost:5000/api/books/detail => to get book detail by ID [POST]
   localhost:5000/api/buy/request => to request book to the owner [POST]
   localhost:5000/api/buy/owner => to get book owner detail [POST]


   ```
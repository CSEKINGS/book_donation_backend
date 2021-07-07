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

3. Create a `.env` file and enter following

   ```env
   MONGODB_URI = Your mongodb connection url
   PORT = Port number
   SECRET_KEY = access token secret key 
   EXPIRES_IN = access token expiration time
   REFRESH_SECRET_KEY = Refresh token secret key
   REFRESH_LIFE = refresh token expiration time 
   SERVICE = Mail service
   GMAIL = Username
   GPASS = password
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
   localhost:5000/api/user/delete => to delete user account
   localhost:5000/api/books/titles => to get book id and titles
   localhost:5000/api/books/create => to create new book
   localhost:5000/api/books/edit => to edit new book
   localhost:5000/api/books/delete => to delete book details
   localhost:5000/api/books/locations => to get book name, id and location
   localhost:5000/api/books/detail => to get book detail by ID
   localhost:5000/api/buy/request => to request book to the owner
   localhost:5000/api/buy/owner => to get book owner detail
   ```
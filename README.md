# Book Donation Backend

Check out current hosting here: https://book-donation-api.herokuapp.com/

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
   localhost:5000/ => Please visit to view Documantation


   ```

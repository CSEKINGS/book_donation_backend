const express = require("express");
const mongoose = require("mongoose");
const route = require('./api/routes/route');

const errorHandler = require("./api/middleware/errorHandling");

const connectDB = require("./configuration/dbConnection");

require('dotenv').config();

const app = express();

connectDB();

app.use(express.json());

app.get('/', (req, res) => {
  res.send("Your API is Started");
});

app.use('/api', route);


app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("Sever running on port "+PORT);
}
);

process.on('unhandledRejection', error => {
  console.log('unhandledRejection', error.message);
});
const express = require("express");
const mongoose = require("mongoose");
const route = require('./app/routes/route');
const secret = require("./app/routes/secret")

const token_middleware = require("./app/middleware/tokenCheker")
const errorHandler = require("./app/middleware/errorHandling")


require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected'))
  .catch((err) => console.log(err));

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send("Your API is Started");
});

app.use('/api', route);

app.use('/secret', token_middleware, secret);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Sever running on port "+PORT);
}
);

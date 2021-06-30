const mongoose = require('mongoose');

module.exports = async () => {
   await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true,
    useFindAndModify: true})
    .then(() => console.log('Database Connected'))
    .catch((err) => console.log(err));
}

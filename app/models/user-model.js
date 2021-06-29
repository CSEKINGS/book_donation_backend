const mongoose = require("mongoose");


let Userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },

});
const User = mongoose.model("User", Userschema);
module.exports = User;

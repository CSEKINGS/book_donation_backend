const mongoose = require("mongoose");


let Userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    photo: {
        type: String,
        default: "No profile updated"
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
/// use string for phone number instead of number
    mobileNo: {
        type: String,
        required:true,
        unique: true
    },
    address: {
        type: String,
        required:true
    },
    about: {
        type: String,
        default: "Nothing to show"
    },
    userLog: [{
        ip: { //request.connection.remoteAddress
            type: String,
            required: true
        },
        timeStamp: {
            type: String,
            default: function () { return this.ip && new Date().toLocaleString(); }
        },
        _id: false
    }],
}, {
    versionKey: false
});
const User = mongoose.model("User", Userschema);
module.exports = User;

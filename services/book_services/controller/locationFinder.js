const User = require("../../../models/user-model")

/**
 * Location Finder 
 * @param {String} user_id
 */
module.exports = async (user_id) => {
    try {
        user_location =await User.findById(user_id,"location -_id");
        return ({location:user_location.location});
    }
    catch(err){
        return({err:err});
    }
}
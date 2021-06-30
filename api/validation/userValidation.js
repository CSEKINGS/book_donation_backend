const email_pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

exports.loginValidation = async (data) => {
    let errors = {}
    if (!(data.email.match(email_pattern))) {
        errors.code = 400;
        errors.message = 'Not a valid Email';
    }
    else if (data.password.length < 8 || !data.password) {
        errors.code = 400;
        errors.message = "Password must be greater than 8";
    }
    return errors
}

exports.registerValidation = async (data) => {
    let errors = {}
    if (!(data.email.match(email_pattern))) {
        errors.code = 400;
        errors.message = "Not a valid Email";
    }
    else if (data.password.length < 8 || !data.password) {
        errors.code = 400;
        errors.message = "Password must be greater than 8";
    }
    else if (!data.name) {
        errors.code = 400;
        errors.message = "Name is required";
    }
    return errors
}

exports.isEmpty = (data) => {
    for (var i in data) {
        return false;
    }
    return true;
}
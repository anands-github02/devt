const Validator = require('validator')

const validateSignUpApi=(req)=>{
    const {email, password, firstName, lastName} = req
    if(!Validator.isEmail(email)){
        throw new Error('Not a valid Email')
    }
    if(!Validator.isStrongPassword(password)){
        throw new Error('Not a strong password')
    }
}

const validateUpdateUserApi = (req)=>{
    const user=req;

    const allowedFields = ['firstName', 'lastName', 'age'];

    const isAllowed = Object.keys(user).every(u=>allowedFields.includes(u));
    return isAllowed;
}

const validateUpdatePasswordApi = (req)=>{
    const password=req;
    if(!password|| !Validator.isStrongPassword(password)){
        throw new Error('Enter a new Password')
    }
    else{
        return true;
    }

   
}

module.exports={validateSignUpApi,validateUpdateUserApi,validateUpdatePasswordApi}
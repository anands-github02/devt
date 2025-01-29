const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const validator = require('validator')
const bcrypt = require('bcrypt');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        trim: true,
        minlength: [2, 'First name must be at least 2 characters long'],
        maxlength: [50, 'First name cannot exceed 50 characters']
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        trim: true,
        minlength: [2, 'Last name must be at least 2 characters long'],
        maxlength: [50, 'Last name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true, // Ensures email uniqueness in the database
        lowercase: true,
        trim: true,
        // match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'] ,// Basic email regex validation
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Not a valid Email ')
            }
        }
    },
    age: {
        type: Number,
        // required: [true, 'Age is required'],
        min: [18, 'Age must be at least 18'], // Assuming 18+ age restriction
        max: [100, 'Age must be less than or equal to 100'] // Optional max age validation
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
        // Additional validation such as regex for complexity can be added
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], // Restricts gender to specific values
        default: 'Other'
    },
    skills: {
        type: [String],
        // validate: {
        //     validator: function(v) {
        //         return Array.isArray(v) && v.length > 0; // Ensures at least one skill
        //     },
        //     message: 'Please provide at least one skill'
        // }
    },
    profileUrl: {
        type: String,
        default: 'img',
        // match: [/^https?:\/\/.*\.(jpeg|jpg|gif|png)$/, 'Please provide a valid URL for the profile image'] // Basic URL validation for images
    }
}, { timestamps: true });

userSchema.methods.getJwt = async function(){
    const user = this;

    const token = await jwt.sign({_id:user._id}, 'NamasteDev', {expiresIn:'1d'});
    return token;
}

userSchema.methods.validateToken = async function(pwd){
    const user = this;
    return bcrypt.compare(pwd, user.password)
}

const User = mongoose.model('User', userSchema);

module.exports = { User }; // Ensure this matches the import in the main file

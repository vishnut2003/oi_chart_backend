const mongoose = require('mongoose')
const { Schema } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    loggedIn: {
        type: Boolean,
        required: true,
        default: false
    },
    expiryDate: {
        type: Date,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
})

const User = mongoose.model('Users', userSchema);

module.exports = User;
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
    active: {
        type: Boolean,
        required: true,
        default: false
    },
    loggedIn: {
        type: Boolean,
        required: true,
        default: false
    },
    registerDate: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const User = mongoose.model('Users', userSchema);

module.exports = User;
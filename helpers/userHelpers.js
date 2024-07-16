const User = require('../models/userModel')
const bcrypt = require('bcrypt')

module.exports = {
    registerUser: (newUser) => {
        return new Promise(async (resolve, reject) => {

            // hash password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(newUser.password, salt)

            newUser.password = hashPassword;

            // write to database
            const user = new User(newUser)
            await user.save()
                .then((res) => {
                    resolve('User Created Successfully')
                })
                .catch((err) => {
                    reject('Email or Username already exist!')
                })
        })
    },
    loginUser: (user) => {
        return new Promise(async (resolve, reject) => {
            const existUser = await User.findOne({ email: user.email })
            if (existUser.loggedIn === true) reject('Only one user can access at one time');
            if (!existUser) reject("User doesn't exist!");
            else {
                // varyfy password
                const valid = await bcrypt.compare(user.password, existUser.password)
                if (valid) {
                    const userId = existUser._id
                    const existUserId = userId.toString()

                    User.findByIdAndUpdate(existUserId, { loggedIn: true })
                        .then((res) => {
                            resolve(existUser);
                        })

                } else {
                    reject('Password is incorrect');
                }

            }
        })
    },
    getOneUser: (id) => {
        return new Promise(async (resolve, reject) => {
            const user = await User.findById(id)
            if (!user) reject()
            else resolve(user)
        })
    },
    searchUsers: (email) => {
        return new Promise((resolve, reject) => {
            User.findOne({ email })
                .then((res) => {
                    resolve(res)
                })
        })
    },
    logoutUser: (userId) => {
        return new Promise((resolve, reject) => {
            User.findByIdAndUpdate(userId, { loggedIn: false })
                .then((res) => {
                    resolve()
                })
        })
    }
}
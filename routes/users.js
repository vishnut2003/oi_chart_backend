const router = require('express').Router();
const userHelpers = require('../helpers/userHelpers')

router.post('/verify', (req, res) => {
    userHelpers.getOneUser(req.body.userId)
        .then((user) => {
            res.status(200).send(user)
        })
        .catch(() => {
            res.status(400).send('user not found')
        })
})

router.post('/search-users', (req, res) => {
    const email = req.body.email
    userHelpers.searchUsers(email)
        .then((users) => {
            if (users === null) return res.status(404).send('User not found')
            res.status(200).send(users)
        })
})

module.exports = router;
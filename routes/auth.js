const router = require('express').Router();
const userHelpers = require('../helpers/userHelpers')
const jwt = require('jsonwebtoken');

router.post('/login', (req, res) => {
    userHelpers.loginUser(req.body)
        .then((user) => {
            res.status(200).json({
                user: user
            })
        })
        .catch((err) => {
            res.status(400).send(err)
        })
})

router.post('/register', async (req, res) => {
    await userHelpers.registerUser(req.body)
        .then((message) => {
            res.status(200).send(message)
        })
        .catch((err) => {
            res.status(400).send(err)
        })
})

router.get('/logout/:id', (req, res) => {
    userHelpers.logoutUser(req.params.id)
        .then(() => {
            res.status(200).send(true)
        })
})

module.exports = router;
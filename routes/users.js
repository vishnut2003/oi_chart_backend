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

module.exports = router;
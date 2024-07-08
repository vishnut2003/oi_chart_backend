const express = require('express')
const router = express.Router()
const fsPromise = require('fs/promises')
const fs = require('fs')
const path = require('path')
const breezeHelpers = require('../helpers/breezeHelpers')

router.get('/', (req, res) => {
    res.send('Working')
})

router.get('/genetate-session-key', (req, res) => {
    const API_KEY = process.env.API_KEY;
    const generateURL = `https://api.icicidirect.com/apiuser/login?api_key=${encodeURI(API_KEY)}`
    res.redirect(generateURL)
})

router.post('/save-session-key', async (req, res) => {
    const session_key = req.query.apisession;

    try {
        if (!fs.existsSync(path.join(__dirname, 'credentials'))) {
            await fs.mkdirSync(path.join(__dirname, 'credentials'))
        }
        await fsPromise.writeFile(path.join(__dirname, 'credentials', 'access_token.txt'), session_key)
        res.send('SESSION_KEY generated successfully')
    } catch (err) {
        res.send(err);
    }
})

router.get('/get-nifty-data', async (req, res) => {
    const session_token = await breezeHelpers.getApiSessionKey()
    const expiry = '2024-07-11T04:00:00'
    await breezeHelpers.getNiftyData(session_token, expiry)
})

module.exports = router
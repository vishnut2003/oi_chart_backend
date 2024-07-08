const router = require('express').Router()
const fyersAPI = require('fyers-api-v3').fyersModel
const fs = require('fs')
const fsPromise = require('fs/promises')
const path = require('path')
const fyersHelpers = require('../helpers/fyersHelpers')

// Credentials for fyers
const appId = process.env.FYERS_API_ID
const secretId = process.env.FYERS_API_SECRET

router.get('/generate-auth', (req, res) => {

    const redirectURL = req.protocol + '://' + req.get('host') + '/fyers/generate-refresh-token'

    const fyers = new fyersAPI()
    fyers.setAppId(appId)
    fyers.setRedirectUrl(redirectURL)

    const authCodeURL = fyers.generateAuthCode()

    res.redirect(authCodeURL)

})

router.get('/generate-refresh-token', (req, res) => {

    const redirectURL = req.protocol + '://' + req.get('host') + '/fyers/generate-refresh-token'

    const fyers = new fyersAPI()
    fyers.setAppId(appId)
    fyers.setRedirectUrl(redirectURL)

    const authCode = req.query.auth_code;
    const secretKey = secretId;

    fyers.generate_access_token({
        secret_key: secretKey,
        auth_code: authCode
    })
        .then(async (response) => {

            try {
                if (!fs.existsSync(path.join(__dirname, 'credentials'))) {
                    await fs.mkdirSync(path.join(__dirname, 'credentials'))
                }
                await fsPromise.writeFile(path.join(__dirname, 'credentials', 'fyers_refresh_token.txt'), response.refresh_token)
                res.send('Refresh token generated successfully')
            } catch (err) {
                res.send(err);
            }
        })

})

router.get('/nfo-symbols', async (req, res) => {    
    const symbols = await fyersHelpers.getAllSymbols()
    res.send(symbols)
})

router.get('/nifty-expiry', async (req, res) => {
    const redirectURL = req.protocol + '://' + req.get('host') + '/fyers/generate-refresh-token'
    const accessToken = await fyersHelpers.generateNewAccess()
    fyersHelpers.getNiftyExpiry(redirectURL, accessToken)
        .then((expiry) => {
            res.send(expiry);
        })
})

router.get('/expiry/:symbol', async (req, res) => {
    const redirectURL = req.protocol + '://' + req.get('host') + '/fyers/generate-refresh-token'
    const accessToken = await fyersHelpers.generateNewAccess()
    fyersHelpers.getSymbolExpiry(redirectURL, accessToken, req.params.symbol)
        .then((expiries) => {
            res.send(expiries)
        })
})

module.exports = router;
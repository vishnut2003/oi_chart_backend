const router = require('express').Router()
const fyersAPI = require('fyers-api-v3').fyersModel

// Credentials for fyers
const appId = process.env.APP_ID
const secretId = process.env.SECRET_ID

router.get('/generate-auth', (req, res) => {

    const redirectURL = req.protocol + '://' + req.get('host') + '/fyers/generate-access-token/'

    const fyers = new fyersAPI()
    fyers.setAppId(appId)
    fyers.setRedirectUrl(redirectURL)

    const authCodeURL = fyers.generateAuthCode()

    res.redirect(authCodeURL)
    
})

router.get('/generate-access-token', (req, res) => {
    res.send(req.query)
})

module.exports = router;
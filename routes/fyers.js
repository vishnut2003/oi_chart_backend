const router = require('express').Router()
const fyersAPI = require('fyers-api-v3').fyersModel
const fs = require('fs')
const fsPromise = require('fs/promises')
const path = require('path')
const fyersHelpers = require('../helpers/fyersHelpers')

// Credentials for fyers
const appId = process.env.APP_ID
const secretId = process.env.SECRET_ID

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
                await fsPromise.writeFile(path.join(__dirname, 'credentials', 'access_token.txt'), response.access_token)
                await fsPromise.writeFile(path.join(__dirname, 'credentials', 'refresh_token.txt'), response.refresh_token)
                res.send('Refresh token generated successfully')
            } catch (err) {
                res.send(err);
            }
        })

})

router.get('/oi-data', async (req, res) => {
    const access_token = await fyersHelpers.generateNewAccess()
    
    fyersHelpers.getAllSymbols(access_token)
        .then((response) => {
            console.log(response)
            res.json(response)
        })
        .catch((err) => {
            res.json(err)
        })

})

module.exports = router;
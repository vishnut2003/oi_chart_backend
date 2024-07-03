const fyersModel = require('fyers-api-v3').fyersModel
const { default: axios } = require('axios')
const fsPromise = require('fs/promises')
const path = require('path')
const crypto = require('crypto')

module.exports = {
    generateNewAccess: async () => {

        const concatenatedString = process.env.APP_ID + process.env.SECRET_ID;
        const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');

        const pin = process.env.FYERS_PIN
        const refreshToken = await fsPromise.readFile(path.join(__dirname, '..', 'routes', 'credentials', 'refresh_token.txt'), { encoding: 'utf8' })

        const response = await axios.post('https://api.fyers.in/api/v2/validate-refresh-token', {
            grant_type: 'refresh_token',
            appIdHash: hash,
            refresh_token: refreshToken,
            pin: pin
        })

        return response.data.access_token

    },
    getAllSymbols: (access_token) => {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await axios.get('https://api.fyers.in/api/v2/symbols', {
                    headers: {
                        'Authorization': `Bearer ${access_token}`,
                    },
                    params: {
                        exchange: 'NSE_FO'
                    }
                })

                resolve(response.data)

            } catch(err) {
                reject(err)
            }
        })
    }
}
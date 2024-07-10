const fyersModel = require('fyers-api-v3').fyersModel
const { default: axios } = require('axios')
const fsPromise = require('fs/promises')
const path = require('path')
const crypto = require('crypto')
const symbolCsv = require('../additional_process/forcsv');

module.exports = {
    generateNewAccess: async () => {

        const concatenatedString = process.env.FYERS_API_ID + process.env.FYERS_API_SECRET;
        const hash = crypto.createHash('sha256').update(concatenatedString).digest('hex');

        const pin = process.env.FYERS_PIN
        const refreshToken = await fsPromise.readFile(path.join(__dirname, '..', 'routes', 'credentials', 'fyers_refresh_token.txt'), { encoding: 'utf8' })

        const response = await axios.post('https://api.fyers.in/api/v2/validate-refresh-token', {
            grant_type: 'refresh_token',
            appIdHash: hash,
            refresh_token: refreshToken,
            pin: pin
        })

        return response.data.access_token

    },
    getAllSymbols: async () => {
        const symbolsSet = await symbolCsv()
        const symbols = [...symbolsSet[0]]
        return symbols
    },
    getSymbolExpiry: (redirectUrl, access_token, rawSymbol) => {
        return new Promise((resolve, reject) => {
            let symbol;
            const appId = process.env.FYERS_API_ID

            const fyers = new fyersModel();
            fyers.setAppId(appId);
            fyers.setRedirectUrl(redirectUrl);
            fyers.setAccessToken(access_token);

            rawSymbol = rawSymbol.toUpperCase();

            if(rawSymbol == 'NIFTY') 
                symbol = `NSE:NIFTY50-INDEX`;
            else if (rawSymbol.includes('BANKNIFTY'))
                symbol = `NSE:NIFTYBANK-INDEX`;
            else if (rawSymbol.includes('NIFTY'))
                symbol = `NSE:${rawSymbol}-INDEX`
            else symbol = `NSE:${rawSymbol}-EQ`;

            fyers.getOptionChain({
                symbol: symbol,
            })
            .then((res) => {
                let rawExpiryObject = []
                rawExpiryObject = res.data.expiryData || [];

                const currentMonth = new Date().getMonth() + 1;
                const currentYear = new Date().getFullYear();
                const monthDate = currentMonth + '-' + currentYear;

                const expiryObject = rawExpiryObject.filter((expiry, index) => {
                    if (expiry.date.includes(monthDate)) {
                        return expiry
                    }
                })

                resolve(expiryObject)
            })
        })
    }
}
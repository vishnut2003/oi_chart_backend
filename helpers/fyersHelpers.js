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
    getNiftyExpiry: (redirectUrl, access_token) => {

        return new Promise(async (resolve, reject) => {

            // fyers credencials
            const app_id = process.env.FYERS_API_ID

            const fyers = new fyersModel()
            fyers.setAppId(app_id)
            fyers.setAccessToken(access_token)
            fyers.setRedirectUrl(redirectUrl)

            fyers.getOptionChain({
                symbol: "NSE:NIFTY50-INDEX",
                strikecount: 1,
                timestamp: ""
            })
            .then((response) => {
                let currentMonth;
                let currentYear;
                const fullExpiry = response.data.expiryData
                const today = new Date()

                // Set Current month
                let rawCurrentMonth = today.getMonth() + 1
                rawCurrentMonth = rawCurrentMonth.toString()
                if(rawCurrentMonth.length === 1) {
                    currentMonth = `0${rawCurrentMonth}`
                } else {
                    currentMonth = rawCurrentMonth
                }

                // set current year
                let rawCurrentYear = today.getFullYear()
                currentYear = rawCurrentYear.toString()

                const expiryDate = fullExpiry.filter((data) => {
                    if(data.date.includes(`${currentMonth}-${currentYear}`)) {
                        return data
                    }
                })
                resolve(expiryDate)

            })
            .catch((err) => {
                console.log(err)
            })
        })
    },
    getSymbolExpiry: (redirectUrl, access_token, rawSymbol) => {
        return new Promise((resolve, reject) => {

            let fullSymbol;
            let expiry;

            // fyers credencials
            const app_id = process.env.FYERS_API_ID

            const fyers = new fyersModel()
            fyers.setAppId(app_id)
            fyers.setAccessToken(access_token)
            fyers.setRedirectUrl(redirectUrl)

            // check if index of EQ
            rawSymbol = rawSymbol.toUpperCase()

            if(rawSymbol == 'NIFTY') {
                fullSymbol = `NSE:${rawSymbol}50-INDEX`;
            }else if(rawSymbol.includes('NIFTY')) {
                if(rawSymbol.includes('BANKNIFTY')) {
                    rawSymbol = 'NIFTYBANK'
                    fullSymbol = `NSE:${rawSymbol}-INDEX`;
                }
                
                fullSymbol = `NSE:${rawSymbol}-INDEX`;
                
            } else {
                fullSymbol = `NSE:${rawSymbol}-EQ`;
            }

            fyers.getOptionChain({
                symbol: fullSymbol,
                strikecount: 1,
                timestamp: "1720605600"
            })
            .then((response) => {

                const today = new Date()

                // Set Current month
                let rawCurrentMonth = today.getMonth() + 1
                rawCurrentMonth = rawCurrentMonth.toString()
                if(rawCurrentMonth.length === 1) {
                    currentMonth = `0${rawCurrentMonth}`
                } else {
                    currentMonth = rawCurrentMonth
                }

                // set current year
                let rawCurrentYear = today.getFullYear()
                currentYear = rawCurrentYear.toString()

                response.data.expiryData ? expiry = response.data.expiryData : expiry = []

                const expiryDate = expiry.filter((data) => {
                    if(data.date.includes(`${currentMonth}-${currentYear}`)) {
                        return data
                    }
                })

                resolve(expiryDate)
            })
            .catch((err) => {
                console.log(err)
            })
        })
    },
    getOiData: (redirectUrl, access_token) => {
        return new Promise((resolve, reject) => {
            // fyers credencials
            const app_id = process.env.APP_ID

            const fyers = new fyersModel()
            fyers.setAppId(app_id)
            fyers.setAccessToken(access_token)
            fyers.setRedirectUrl(redirectUrl)

            // test data
            const symbol = 'NSE:NIFTY50-INDEX'
            const resolution = '5'
            const date_format = 1
            const range_from = '2024-07-01'
            const range_to = '2024-07-05'
            const cont_flag = 1
            const oi_flag = 1

            fyers.getHistory({
                symbol: symbol,
                resolution: resolution,
                date_format: date_format,
                range_from: range_from,
                range_to: range_to,
                cont_flag: cont_flag,
                oi_flag: oi_flag
            })
            .then((res) => {
                console.log(res)
                resolve()
            })
            .catch((err) => {
                console.log(err)
            })
        })
    }
}
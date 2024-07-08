const fsPromise = require('fs/promises')
const path = require('path')
const BreezeConnect = require('uatbreezeconnect').BreezeConnect

module.exports = {
    getApiSessionKey: async () => {
        const sessionKey = await fsPromise.readFile(path.join(__dirname, '..', 'routes', 'credentials', 'access_token.txt'), { encoding: 'utf8' })
        return sessionKey
    },
    getNiftyData: (sessionKey, expiry) => {
        const apiKey = process.env.API_KEY
        const secretKey = process.env.SECRET_KEY

        const breeze = new BreezeConnect({
            "appKey": apiKey
        })
        breeze.generateSession({
            "secretKey": secretKey,
            "sessionToken": sessionKey
        })
            .then((res) => {
                const date = new Date()
                const year = date.getFullYear()
                const month = date.getMonth()
                const day = date.getDate()

                const fromDate = new Date(year, 6, day, 9, 15, 0).toISOString()
                const toDate = new Date(year, 6, day, 17, 30, 0).toISOString()

                breeze.getHistoricalData({
                    interval: '5minute',
                    fromDate: fromDate,
                    toDate: toDate,
                    stockCode: 'NIFTY',
                    exchangeCode: "NFO",
                    productType: "options",
                    expiryDate: expiry,
                    right: "call",
                    strikePrice: '9000'
                })
                .then((res) => {
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}
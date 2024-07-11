const fsPromise = require('fs/promises')
const path = require('path')
const BreezeConnect = require('breezeconnect').BreezeConnect

module.exports = {
    getApiSessionKey: async () => {
        const sessionKey = await fsPromise.readFile(path.join(__dirname, '..', 'routes', 'credentials', 'access_token.txt'), { encoding: 'utf8' })
        return sessionKey
    },
    getOiData: (access_token, symbol, expiry, intervel, startDate, endDate, strikeRange) => {
        return new Promise((resolve, reject) => {
            const apiKey = process.env.API_KEY
            const secretKey = process.env.SECRET_KEY

            let callOi = []
            let putOi = []

            const breeze = new BreezeConnect({ "appKey": apiKey })
            breeze.generateSession(secretKey, access_token)
                .then(() => {
                    breeze.getHistoricalDatav2({
                        interval: intervel, 
                        fromDate: startDate,
                        toDate: endDate,
                        stockCode: symbol,
                        exchangeCode: "NFO",
                        productType: "options", 
                        expiryDate: expiry,
                        right: "call",
                        strikePrice: strikeRange[0].strike_price
                    })
                    .then((res) => {
                        resolve(res)
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        })
    }
}
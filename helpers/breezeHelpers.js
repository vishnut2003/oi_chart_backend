const fsPromise = require('fs/promises')
const path = require('path')
const BreezeConnect = require('breezeconnect').BreezeConnect

module.exports = {
    getApiSessionKey: async () => {
        const sessionKey = await fsPromise.readFile(path.join(__dirname, '..', 'routes', 'credentials', 'access_token.txt'), { encoding: 'utf8' })
        return sessionKey
    },
    getNiftyData: (sessionKey) => {
        const apiKey = process.env.API_KEY
        const secretKey = process.env.SECRET_KEY

        const breeze = new BreezeConnect({ "appKey": apiKey })

        breeze.generateSession(secretKey, sessionKey)
            .then((res) => {
                breeze.getOptionChainQuotes(
                    {
                        stockCode: "NIFTY",
                        exchangeCode: "NFO",
                        productType: "options",
                        expiryDate: "2024-07-11T06:00:00.000Z",
                        right: "call",
                    }
                )
                    .then((res) => {
                        const strike_price = []
                        const callOiData = []

                        const fullData = res.Success
                        for (let i = 0; i < fullData.length; i++) {
                            strike_price.push(fullData[i].strike_price)
                        }

                        for (let i = 0; i < strike_price.length; i++) {
                            breeze.getHistoricalDatav2(
                                {
                                    interval: "30minute",       //'1second', '1minute', '5minute', '30minute','1day'
                                    fromDate: "2024-07-03T07:00:00.000Z",
                                    toDate: "2024-07-04T07:00:00.000Z",
                                    stockCode: "NIFTY",
                                    exchangeCode: "NFO",      // 'NSE','BSE','NFO','NDX,'MCX'
                                    productType: "options",   // "futures","options",'cash'
                                    expiryDate: "2024-07-11T07:00:00.000Z",
                                    right: "call",           // "call","put", "others" 
                                    strikePrice: strike_price[i]
                                }
                            )
                                .then((res) => {
                                    if (!callOiData[i]) {
                                        if (res.Success !== undefined) {
                                            if (res.Success.length != 0) {
                                                callOiData.push(res.Success[i])
                                                console.log(res.Success)
                                            }
                                        }
                                    }
                                    else callOiData[i].strike_price += res.Success[i].strike_price
                                })

                        }
                        const finale = []

                        console.log(callOiData)

                    })
            })
            .catch((err) => {
                console.log(err)
            })
    }
}
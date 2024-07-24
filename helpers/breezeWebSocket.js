const { getApiSessionKey, getOiData } = require('./breezeHelpers')
const BreezeConnect = require('breezeconnect').BreezeConnect

const runWebSocket = (stockInfo) => {
    return new Promise(async (resolve, reject) => {

        let symbol = stockInfo.symbol;
        let expiry = stockInfo.expiryDate;
        let intervel = stockInfo.intervel;
        let date = stockInfo.historical;
        let strikeRange = stockInfo.strikeRange;

        if (expiry) expiry = expiry.split('-')
        if (date) date = date.split('-')

        // expiry date
        let expiryDay = expiry[0]
        let expiryMonth = expiry[1]
        let expiryYear = expiry[2]
        const fullExpiry = `${expiryYear}-${expiryMonth}-${expiryDay}T07:00:00.000Z`

        // date and next date
        let specDateYear = date[0]
        let specDateMonth = date[1]
        let specDateDay = date[2]
        const specStartDate = `${specDateYear}-${specDateMonth}-${specDateDay}T07:00:00.000Z`
        let specEndDate = new Date(`${specDateYear}-${specDateMonth}-${specDateDay} 12:30`)
        specEndDate.setDate(specEndDate.getDate() + 1)
        specEndDate = specEndDate.toISOString()

        const accessToken = await getApiSessionKey()
        getOiData(accessToken, symbol, fullExpiry, intervel, specStartDate, specEndDate, strikeRange)
            .then((oi) => {
                resolve(oi.lineData[oi.lineData.length - 1])
            })
            .catch((err) => {
                console.log(err)
            })
    })
}

module.exports = runWebSocket
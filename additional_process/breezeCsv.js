const fs = require('fs')
const { parse } = require('csv-parse')
const path = require('path')

let csvData = []
const readedObj = []

const getBreezeSymbols = async () => {
    return new Promise((resolve, reject) => {

        fs.createReadStream(path.join(__dirname, 'breeze-fno-stocks.csv'))
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", async (row) => {
                if (!readedObj.includes(row[2])) {
                    const symbolObj = {
                        symbol: row[2],
                        name: row[row.length - 1]
                    }
                    csvData.push(symbolObj)
                    readedObj.push(row[2])
                    // fs.appendFile(path.join(__dirname, 'writehere.txt'), "{ \n symbol: '" + row[2] + "', \n name: '" + row[row.length - 1] + "', \n fyersSymbol: '' \n }, \n", function (err) {
                    //     if (err) throw err;
                    //     console.log('Saved!');
                    // });
                }
            })
            .on('error', (err) => {
                console.log(err)
            })
            .on('end', async () => {
                let niftyObj;
                csvData.map((symbolItems, index) => {
                    if(symbolItems.symbol == 'NIFTY') {
                        niftyObj = symbolItems
                    }
                })
                const symbolSet = new Set(csvData)
                csvData = [...symbolSet]
                csvData.unshift(niftyObj)
                resolve(csvData)
            })
    })
}

module.exports = getBreezeSymbols
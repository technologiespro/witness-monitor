const provider = require('../modules/provider')
const jsonFile = require('jsonfile')
const assets = jsonFile.readFileSync('./config.json').priceFeeds.assets

// bitshares symbol:paprika symbol
const currency = {
    "EUR": "EUR",
    "RUBLE": "RUB",
    "USD": "USD",
    "CNY": "CNY",
    "JPY": "JPY",
    "GBP": "GBP",
    "AUD": "AUD",
}

const providerPaprika = new provider({
    apiUrl: "https://api.coinpaprika.com/v1/tickers/bts-bitshares?quotes=",
    currency: currency
})

class paprika {
    async getPrices() {
        const quotes = (await providerPaprika.getPrices()).quotes
        let result = {}
        let qAssets = Object.keys(assets)
        for (let i = 0; i < qAssets.length; i++) {
            result[qAssets[i]] = {
                price: quotes[currency[qAssets[i]]].price,
                cer: 0,
            }
        }

        return result
    }
}

module.exports = paprika;



const provider = require('../modules/provider')
const currency = {
    "EUR": "EUR",
    "RUBLE": "RUB",
}

const providerPaprika = new provider({
    apiUrl: "https://api.coinpaprika.com/v1/tickers/bts-bitshares?quotes=",
    currency: currency
})

class paprika {
    async getPrices() {
        const quotes = (await providerPaprika.getPrices()).quotes
        let result = {}
        let qAssets = Object.keys(currency)
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



const provider = require('../modules/provider')

const providerPaprika = new provider({
    apiUrl: "https://api.coinpaprika.com/v1/tickers/bts-bitshares?quotes=",
    currency: {
        "EUR": "EUR",
        "RUBLE": "RUB",
    },
})

class paprika {
    async getPrices() {
        const quotes = (await providerPaprika.getPrices()).quotes
        let result = {
            "EUR": {
                price: quotes.EUR.price.toFixed(6),
                cer: 0,
            },
            "RUBLE": {
                price: quotes.RUB.price.toFixed(6),
                cer: 0,
            },
        }
        return result
    }
}

module.exports = paprika;



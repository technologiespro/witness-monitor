const provider = require('../modules/provider')

const providerPaprika = new provider({
    apiUrl: "https://api.coinpaprika.com/v1/tickers/bts-bitshares?quotes=",
    currency: {
        "EUR": "EUR",
        "USD": "USD",
        "RUBLE": "RUB",
        "CNY": "CNY"
    },
})

class paprika {
    async getPrices() {
        const quotes = (await providerPaprika.getPrices()).quotes
        let result = {
            "CNY": quotes.CNY.price,
            "EUR": quotes.EUR.price,
            "RUBLE": quotes.RUB.price,
            "USD": quotes.USD.price,
        }

        return result
    }
}

module.exports = paprika;



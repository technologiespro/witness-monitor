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
        return await providerPaprika.getPrices()
    }
}

module.exports = paprika;



const provider = require('../modules/provider')

const paprika = new provider({
    apiUrl: "https://api.coinpaprika.com/v1/tickers/bts-bitshares?quotes=",
    currency: {
        "EUR": "EUR",
        "USD": "USD",
        "RUBLE": "RUB",
        "CNY": "CNY"
    },
})

async function getPrices() {
    return await paprika.getPrices()
}

// bitshares asset: coinpaprika ticker
const currency = {
    "EUR": "EUR",
    "USD": "USD",
    "RUBLE": "RUB",
    "CNY": "CNY"
}

const apiUrl = "https://api.coinpaprika.com/v1/tickers/bts-bitshares?quotes=" + Object.values(currency).join()

console.log(apiUrl)

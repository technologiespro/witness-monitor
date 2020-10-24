const provider = require('../modules/provider');
const jsonFile = require('jsonfile');
const assets = jsonFile.readFileSync('./config.json').priceFeeds.assets;

// bitshares symbol:paprika symbol
const currency = {
    "EUR": "EUR",
    "RUBLE": "RUB",
    "USD": "USD",
    "CNY": "CNY",
    "JPY": "JPY",
    "GBP": "GBP",
    "AUD": "AUD",
    "SEK": "SEK",
    "KRW": "KRW",
    "BTC": "BTC",
};

const providerPaprika = new provider({
    apiUrl: "https://api.coinpaprika.com/v1/tickers/bts-bitshares?quotes=",
    currency: currency
});

class paprika {
    async getPrices() {
        const quotes = (await providerPaprika.getPrices()).quotes;
        let result = {};
        let qAssets = Object.keys(assets);
        for (let i = 0; i < qAssets.length; i++) {
            result[qAssets[i]] = {
                price: quotes[currency[assets[qAssets[i]].SYMBOL]].price,
                cer: (quotes[currency[assets[qAssets[i]].SYMBOL]].price + (quotes[currency[assets[qAssets[i]].SYMBOL]].price * 0.10)).toFixed(8) * 1,
            }
        }
        console.log(result);
        return result
    }
}

module.exports = paprika;



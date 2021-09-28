const provider = require('../modules/provider');
const jsonFile = require('jsonfile');
const assets = jsonFile.readFileSync('./config.json').priceFeeds.assets;

// BitShares symbol:Paprika symbol
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
    "MXN": "MXN",
    "CAD": "CAD",
    "CHF": "CHF",
};

const providerPaprika = new provider({
    apiUrl: "https://api.coinpaprika.com/v1/tickers/bts-bitshares?quotes=",
    currency: currency
});



class paprika {
    async getPrices() {
        let quotes = (await providerPaprika.getPrices()).quotes;
        //console.log(quotes)
        let result = {};
        let qAssets = Object.keys(assets);
        const UsdCNY = await providerPaprika.getPriceUSDCNY();
        console.log('UsdCNY', UsdCNY);

        for (let i = 0; i < qAssets.length; i++) {
            if (assets[qAssets[i]].SYMBOL === 'CNY') {
                quotes['CNY'].price = UsdCNY * quotes['USD'].price;
                console.log('CNY_BTS', quotes[currency[assets[qAssets[i]].SYMBOL]].price);
            }
            result[qAssets[i]] = {
                price: quotes[currency[assets[qAssets[i]].SYMBOL]].price,
                cer: (quotes[currency[assets[qAssets[i]].SYMBOL]].price + (quotes[currency[assets[qAssets[i]].SYMBOL]].price * 0.22)).toFixed(8) * 1,
            }
        }
        console.log(result);
        return result
    }
}

module.exports = paprika;



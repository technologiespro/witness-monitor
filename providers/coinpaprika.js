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
        let result = {};
        let qAssets = Object.keys(assets);
        const UsdCNY = await providerPaprika.getPriceUSDCNY();
        const priceGOLD = await providerPaprika.getPriceGOLD();
        for (let i = 0; i < qAssets.length; i++) {
            if (assets[qAssets[i]].SYMBOL === 'CNY') {
                quotes['CNY'].price = UsdCNY * quotes['USD'].price;
            }

            if (assets[qAssets[i]].SYMBOL === 'GOLD') {
                const GOLD_BTS = (priceGOLD.quotes['USD'].price / quotes['USD'].price);
                //console.log('GOLD_BTS',GOLD_BTS)
                result[qAssets[i]] = {
                    price: (1/ GOLD_BTS).toFixed(6) * 1,
                    cer: (1 / (GOLD_BTS + (GOLD_BTS * 0.10))).toFixed(6) * 1,
                }
            } else {
                result[qAssets[i]] = {
                    price: quotes[currency[assets[qAssets[i]].SYMBOL]].price,
                    cer: (quotes[currency[assets[qAssets[i]].SYMBOL]].price + (quotes[currency[assets[qAssets[i]].SYMBOL]].price * 0.10)).toFixed(8) * 1,
                }
            }
        }
        return result

    }
}

module.exports = paprika;



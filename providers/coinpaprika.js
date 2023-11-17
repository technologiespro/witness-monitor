const provider = require('../modules/provider');
const jsonFile = require('jsonfile');
const assets = jsonFile.readFileSync('./config.json').priceFeeds.assets;

// BitShares symbol:Paprika symbol
const currency = {
    "EUR": "EUR",
    "RUBLE": "RUB",
    "USD": "USD",
    "CNY": "CNY",
    "BTC": "BTC",

    "JPY": "JPY",
    "GBP": "GBP",
    "AUD": "AUD",
    "SEK": "SEK",
    "KRW": "KRW",

    "MXN": "MXN",
    "CAD": "CAD",
    "CHF": "CHF",
};

const providerPaprika = new provider({
    apiUrl: "https://api.coinpaprika.com/v1/tickers/bts-bitshares?quotes=",
});


class paprika {
    async getPrices() {
        let quotes1 = (await providerPaprika.getPrices(
            {
                "EUR": "EUR",
                "RUBLE": "RUB",
                "USD": "USD",
            })).quotes;

        let quotes2 = (await providerPaprika.getPrices(
            {
                "CNY": "CNY",
                "BTC": "BTC",
                "JPY": "JPY",
            })).quotes;

        let quotes3 = (await providerPaprika.getPrices(
            {
                "GBP": "GBP",
                "AUD": "AUD",
                "SEK": "SEK",
            })).quotes;

        let quotes4 = (await providerPaprika.getPrices(
            {
                "MXN": "MXN",
                "CAD": "CAD",
                "CHF": "CHF",
            })).quotes;

        let quotes5 = (await providerPaprika.getPrices(
            {
                "KRW": "KRW",
            })).quotes;


        let quotes = Object.assign(quotes1, quotes2, quotes3, quotes4, quotes5);

        let result = {};
        let qAssets = Object.keys(assets);
        //const UsdCNY = await providerPaprika.getPriceUSDCNY();
        const priceGOLD = await providerPaprika.getPriceGOLD();
        //const priceSILVER = await providerPaprika.getPriceSILVER();
        for (let i = 0; i < qAssets.length; i++) {
            if (assets[qAssets[i]].SYMBOL === 'CNY') {
               // quotes['CNY'].price = UsdCNY * quotes['USD'].price;
            }

            if (assets[qAssets[i]].SYMBOL === 'SILVER') {
                /*
                const SILVER_BTS = (priceSILVER.quotes['USD'].price / quotes['USD'].price);
                result[qAssets[i]] = {
                    price: (1 / SILVER_BTS),
                    cer: (1 / (SILVER_BTS + (SILVER_BTS * 0.10))),
                }
                console.log(result[qAssets[i]])

                 */
            } else if (assets[qAssets[i]].SYMBOL === 'GOLD') {
                const GOLD_BTS = (priceGOLD.quotes['USD'].price / quotes['USD'].price);
                result[qAssets[i]] = {
                    price: (1 / GOLD_BTS).toFixed(6) * 1,
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



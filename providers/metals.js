/** metals-api.com provider **/
const axios = require('axios');
const jsonFile = require('jsonfile');
const config = jsonFile.readFileSync('./config.json');
const assets = config.priceFeeds.assetsMetal;
let dataMetals = jsonFile.readFileSync('./metals.json');

// bitshares symbol:metal symbol
const currency = {
    "SILVER": "XAG",
    "GOLD": "XAU",
};


class metals {
    async getPrices(BTS_USD = 0.0231) {
        let result = {};
        let url = 'https://metals-api.com/api/latest?access_key=' + config.API.METALS + '&base=USD&symbols=XAU,XAG,XPD,XPT,XRH'
        try {
            dataMetals = (await axios.get(url)).data;
        } catch(e) {
            console.log(e);
            dataMetals = jsonFile.readFileSync('./metals.json');
        }

        const rates = dataMetals.rates;
        let assetsKeys = Object.keys(assets);
        for (let i = 0; i < assetsKeys.length; i++) {
            if (currency[assets[assetsKeys[i]].SYMBOL]) {
                let USD_METAL = 1 / rates[currency[assets[assetsKeys[i]].SYMBOL]];
                let BTS_METAL = (BTS_USD / USD_METAL).toFixed(8) * 1;
                result[assetsKeys[i]] = {
                    price: Math.floor(BTS_METAL * 1000000) / 1000000,
                    cer: Math.floor((BTS_METAL + (BTS_METAL * 0.18)) * 1000000) / 1000000,
                };
            }
        }
        return result
    }
}

module.exports = metals;



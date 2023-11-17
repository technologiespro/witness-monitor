const axios = require('axios');

class priceProvider {
    constructor(config) {
        this.config = config
    }

    async getPrices(currency = {
        "EUR": "EUR",
        "RUBLE": "RUB",
        "USD": "USD",
        "CNY": "CNY",
        "BTC": "BTC"
    }
    ) {
        let result = null;
        const apiUrl = this.config.apiUrl + Object.values(currency).join();
        try {
            result = (await axios.get(apiUrl)).data;
        } catch (e) {
            console.log('err:getPrices', e)
        }
        return result
    }

    async getPriceUSDCNY() {
        let USD_CNY = 6.21;
        try {
            let rez = await axios.get(
                'https://otc-api.hbg.com/v1/trade/fast/config/list?side=sell&tradeMode=fast',
                {headers: {portal: 'web'}}
            );
            for (let i = 0; i < rez.data.data.length; i++) {
                if (rez.data.data[i].cryptoAsset.name === 'USDT') {
                    for (let j = 0; j < rez.data.data[i].quoteAsset.length; j++) {
                        if (rez.data.data[i].quoteAsset[j].name === 'CNY') {
                            USD_CNY = rez.data.data[i].quoteAsset[j].price;
                            console.log(rez.data.data[i].quoteAsset[j]);
                            break;
                        }
                    }
                }
            }
        } catch (e) {

        }
        return USD_CNY;
    }

    async getPriceGOLD() {
        let result = null;
        const apiUrl = "https://api.coinpaprika.com/v1/tickers/xaut-tether-gold";
        try {
            result = (await axios.get(apiUrl)).data;
        } catch (e) {

        }
        return result
    }

    async getPriceSILVER() {
        //найти рабочий апи
        let result = null;
        const apiUrl = "https://api.coinpaprika.com/v1/tickers/xag-silver-spot-token";
        try {
            result = (await axios.get(apiUrl)).data;
        } catch (e) {

        }
        return result
    }
}


module.exports = priceProvider;

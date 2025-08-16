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

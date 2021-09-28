const axios = require('axios');

class PriceCNY {
    async getPriceUSDCNY() {
        let USD_CNY = 6.21;
        try {
            let rez = await axios.get(
                'https://otc-api.hbg.com/v1/trade/fast/config/list?side=sell&tradeMode=fast',
                {headers: {portal: 'web'}}
            );
            for (let i = 0; i < rez.data.data.length; i++) {
                if (rez.data.data[i].cryptoAsset.name === 'USDT') {
                    for (let j=0; j < rez.data.data[i].quoteAsset.length; j++) {
                        if (rez.data.data[i].quoteAsset[j].name === 'CNY') {
                            USD_CNY = rez.data.data[i].quoteAsset[j].price;
                            console.log(rez.data.data[i].quoteAsset[j]);
                            break;
                        }
                    }
                }
            }
        } catch(e) {

        }
        return USD_CNY;
    }
}

module.exports = PriceCNY;
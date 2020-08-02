const axios = require('axios')

class priceProvider {
    constructor(config) {
        this.config = config
    }

    async getPrices() {
        let result = null
        const apiUrl = this.config.apiUrl + Object.values(this.config.currency).join()
        try {
            result = (await axios.get(apiUrl)).data
        } catch(e) {

        }
        return result
    }
}


module.exports = priceProvider;

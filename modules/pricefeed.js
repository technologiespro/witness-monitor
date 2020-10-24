class feeds {
    constructor(options) {
        this.options = options;
        this.assets = {};
        this.latestFeeds = {};
    }

    async init() {
        this.account = new this.options.BitSharesInstance(this.options.config.producer.name, this.options.config.producer.key);
        this.feeder = await this.options.BitSharesInstance.accounts[this.options.config.producer.name];
        console.log('account', this.feeder.id, this.feeder.name);
    }

    async feelPrices() {
        this.assets[CONFIG.coreAsset] = (await BitShares.assets[CONFIG.coreAsset]);
        let feedAssets = Object.keys(CONFIG.priceFeeds.assets);
        this.latestFeeds = await paprika.getPrices();
        for (let i = 0; i < feedAssets.length; i++) {
            assets[feedAssets[i]] = (await BitShares.assets[feedAssets[i]]);
            latestFeeds[feedAssets[i]].cer = (latestFeeds[feedAssets[i]].price + (latestFeeds[feedAssets[i]].price * 0.08)).toFixed(8) * 1;
        }
    }


}

module.exports = feeds;

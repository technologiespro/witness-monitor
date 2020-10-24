const Paprika = require('../providers/coinpaprika');
const paprika = new Paprika();

const Metals = require('../providers/metals');
const metals = new Metals();

class feeds {
    constructor(options) {
        this.options = options;
        this.assets = {};
        this.latestFeeds = {};
        this.latestFeedsMetal = {};
        this.assetsMetal = {};
    }

    async init() {
        this.account = new this.options.BitSharesInstance(this.options.config.producer.name, this.options.config.producer.key);
        this.feeder = await this.options.BitSharesInstance.accounts[this.options.config.producer.name];
        console.log('init account', this.feeder.id, this.feeder.name);
    }

    async feelPrices() {
        this.assets[this.options.config.coreAsset] = (await this.options.BitSharesInstance.assets[this.options.config.coreAsset]);
        const feedAssets = Object.keys(this.options.config.priceFeeds.assets);
        this.latestFeeds = await paprika.getPrices();
        for (let i = 0; i < feedAssets.length; i++) {
            this.assets[feedAssets[i]] = (await this.options.BitSharesInstance.assets[feedAssets[i]]);
            this.latestFeeds[feedAssets[i]].cer = (this.latestFeeds[feedAssets[i]].price + (this.latestFeeds[feedAssets[i]].price * 0.08)).toFixed(8) * 1;
        }
        return this.latestFeeds;
    }

    async publishAllFeeds() {
        console.log('-----------------------');
        await this.feelPrices();
        const feedAssets = Object.keys(this.options.config.priceFeeds.assets);
        for (let i = 0; i < feedAssets.length; i++) {
            if (this.latestFeeds[feedAssets[i]].cer > 0) {
                this.latestFeeds[feedAssets[i]].price = Math.floor(this.latestFeeds[feedAssets[i]].price * 10 ** this.assets[feedAssets[i]].precision) / 10 ** this.assets[feedAssets[i]].precision;
                this.latestFeeds[feedAssets[i]].cer = Math.floor(this.latestFeeds[feedAssets[i]].cer * 10 ** this.assets[feedAssets[i]].precision) / 10 ** this.assets[feedAssets[i]].precision;
                try {
                    await this.publishPrice({
                        symbol: feedAssets[i],
                        price: this.latestFeeds[feedAssets[i]].price,
                        cer: this.latestFeeds[feedAssets[i]].cer
                    });
                } catch (e) {
                    console.log('err publish', feedAssets[i]);
                }

            }
        }
        return this.latestFeeds;
    }

    async publishPrice(options) {
        console.log('----------------------');
        console.log('id', this.assets[options.symbol].id);
        console.log('price', options.price);
        console.log('cer', options.cer);
        let params = {
            "publisher": this.feeder.id,
            "asset_id": this.assets[options.symbol].id,
            "feed": {
                "settlement_price": {
                    "base": {
                        "amount": Math.round(options.price * 10 ** this.assets[options.symbol].precision),
                        "asset_id": this.assets[options.symbol].id
                    },
                    "quote": {
                        "amount": 10 ** this.assets[this.options.config.coreAsset].precision,
                        "asset_id": this.assets[this.options.config.coreAsset].id // 1.0.3
                    }
                },
                "maintenance_collateral_ratio": this.options.config.priceFeeds.assets[options.symbol].MCR * 1000,
                "maximum_short_squeeze_ratio": this.options.config.priceFeeds.assets[options.symbol].MSSR * 1000,
                "core_exchange_rate": {
                    "base": {
                        "amount": Math.round(options.cer * 10 ** this.assets[options.symbol].precision),
                        "asset_id": this.assets[options.symbol].id
                    },
                    "quote": {
                        "amount": 10 ** this.assets[this.options.config.coreAsset].precision,
                        "asset_id": this.assets[this.options.config.coreAsset].id // 1.0.3
                    }
                }
            }
        };

        let tx = this.account.newTx();
        tx.asset_publish_feed(params);
        await tx.broadcast();
        console.log('publish price', options.symbol);
    }

    async feelPricesMetal() {
        const feedAssets = Object.keys(this.options.config.priceFeeds.assetsMetal);
        this.latestFeedsMetal = await metals.getPrices(this.latestFeeds['USD1.0'].price);
        for (let i = 0; i < feedAssets.length; i++) {
            this.assetsMetal[feedAssets[i]] = (await this.options.BitSharesInstance.assets[feedAssets[i]]);
        }
        return this.latestFeedsMetal;
    }


}

module.exports = feeds;

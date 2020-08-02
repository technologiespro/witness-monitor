const express = require('express');
const router = express.Router();
const BitShares = require('btsdex')
const jsonFile = require('jsonfile')
const level = require('level')
const scheduler = require("node-schedule")
const db = level('.bitshares', {valueEncoding: 'json'})
const CONFIG = jsonFile.readFileSync('./config.json')

const Paprika = require('../providers/coinpaprika')
const paprika = new Paprika()

let latestFeeds = {}

BitShares.connect(CONFIG.node)
BitShares.subscribe('connected', startAfterConnected);

let bot = null
let feeder = null

async function orderBook(base, quote, limit = 5) {
    let result = null
    try {
        result = await BitShares.getOrderBook(base, quote, limit)
    } catch (e) {

    }
    return result
}

async function getAvgPrice(base, quote) {
    let limit = 2
    let data = await orderBook(base, quote, limit)
    let bids = 0
    let asks = 0

    for (let i = 0; i < data.bids.length; i++) {
        bids = bids + (data.bids[i].price * 1)
    }

    for (let i = 0; i < data.asks.length; i++) {
        asks = asks + (data.asks[i].price * 1)
    }

    let avgPrice = ((bids / limit + asks / limit) / 2) * 1.18
    return avgPrice.toFixed(5)

}

async function publishPrice(options) {
    let assetId = (await BitShares.assets['XBTSX.EUR']).id
    let params = {
        "publisher": feeder.id,
        "asset_id": assetId,
        "feed": {
            "settlement_price": {
                "base": {
                    "amount": options.price,
                    "asset_id": assetId
                },
                "quote": {
                    "amount": 1 * 10 ** 5,
                    "asset_id": "1.3.0"
                }
            },
            "maintenance_collateral_ratio": CONFIG.priceFeeds.assets[options.symbol].MCR * 100,
            "maximum_short_squeeze_ratio": CONFIG.priceFeeds.assets[options.symbol].MSSR * 100,
            "core_exchange_rate": {
                "base": {
                    "amount": options.cer,
                    "asset_id": assetId
                },
                "quote": {
                    "amount": 1 * 10 ** 5,
                    "asset_id": "1.3.0"
                }
            }
        }
    }

    let tx = bot.newTx()
    tx.asset_publish_feed(params)
    let result = await tx.broadcast()
    console.log(result)

    //asset_publish_feed
}

async function startAfterConnected() {

    bot = new BitShares(CONFIG.producer.name, CONFIG.producer.key)
    feeder = await BitShares.accounts[CONFIG.producer.name]
    console.log('registrar', feeder.id, feeder.name)

    /*
    latestFeeds = await paprika.getPrices()
    latestFeeds['RUBLE'].cer = await getAvgPrice('RUBLE', 'BTS')
    latestFeeds['EUR'].cer = await getAvgPrice('EUR', 'BTS')
*/
    scheduler.scheduleJob("1 */1 * * * *", async () => {
        /*
        latestFeeds = await paprika.getPrices()
        latestFeeds['RUBLE'].cer = await getAvgPrice('RUBLE', 'BTS')
        latestFeeds['EUR'].cer = await getAvgPrice('EUR', 'BTS')
         */
    });


    await publishPrice({
        symbol: 'EUR',
        price: Math.trunc(0.022192 * 10 ** 4),
        cer: Math.trunc(0.02728 * 10 ** 4)
    })

}

router.get('/feeds', async function (req, res, next) {
    await res.json(latestFeeds)
});

module.exports = router


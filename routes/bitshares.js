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
let assets = {}

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
    let params = {
        "publisher": feeder.id,
        "asset_id": assets[options.symbol].id,
        "feed": {
            "settlement_price": {
                "base": {
                    "amount": Math.round(options.price * 10 ** assets[options.symbol].precision),
                    "asset_id": assets[options.symbol].id
                },
                "quote": {
                    "amount": 10 ** assets[CONFIG.coreAsset].precision,
                    "asset_id": assets[CONFIG.coreAsset].id // 1.0.3
                }
            },
            "maintenance_collateral_ratio": CONFIG.priceFeeds.assets[options.symbol].MCR * 1000,
            "maximum_short_squeeze_ratio": CONFIG.priceFeeds.assets[options.symbol].MSSR * 1000,
            "core_exchange_rate": {
                "base": {
                    "amount": Math.round(options.cer * 10 ** assets[options.symbol].precision),
                    "asset_id": assets[options.symbol].id
                },
                "quote": {
                    "amount": 10 ** assets[CONFIG.coreAsset].precision,
                    "asset_id": assets[CONFIG.coreAsset].id // 1.0.3
                }
            }
        }
    }

    console.log('params', params)

    let tx = bot.newTx()
    tx.asset_publish_feed(params)
    let result = await tx.broadcast()
    console.log(result)

    //asset_publish_feed
}

async function feelPrices() {
    assets[CONFIG.coreAsset] = (await BitShares.assets[CONFIG.coreAsset])
    let feedAssets = Object.keys(CONFIG.priceFeeds.assets)
    latestFeeds = await paprika.getPrices()
    for (let i = 0; i < feedAssets.length; i++) {
        assets[feedAssets[i]] = (await BitShares.assets[feedAssets[i]])
        latestFeeds[feedAssets[i]].cer = await getAvgPrice(feedAssets[i], 'BTS')
    }
}


async function startAfterConnected() {

    bot = new BitShares(CONFIG.producer.name, CONFIG.producer.key)
    feeder = await BitShares.accounts[CONFIG.producer.name]
    console.log('producer', feeder.id, feeder.name)

    await feelPrices()


//    latestFeeds['RUBLE'].cer = await getAvgPrice('RUBLE', 'BTS')
//    latestFeeds['EUR'].cer = await getAvgPrice('EUR', 'BTS')

    scheduler.scheduleJob("1 */1 * * * *", async () => {
        /*
        latestFeeds = await paprika.getPrices()
        latestFeeds['RUBLE'].cer = await getAvgPrice('RUBLE', 'BTS')
        latestFeeds['EUR'].cer = await getAvgPrice('EUR', 'BTS')
         */
    });

/*
    await publishPrice({
        symbol: 'EUR',
        price: latestFeeds['EUR'].price,
        cer: latestFeeds['EUR'].cer
    })
 */


}

router.get('/feeds', async function (req, res, next) {
    await res.json(latestFeeds)
});

module.exports = router


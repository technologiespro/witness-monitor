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

    for (let i=0; i < data.bids.length; i++) {
        bids = bids + (data.bids[i].price * 1)
    }

    for (let i=0; i < data.asks.length; i++) {
        asks = asks + (data.asks[i].price * 1)
    }

    let avgPrice = ((bids / limit + asks / limit) / 2) * 1.18
    console.log('avgPrice', avgPrice)
    return avgPrice.toFixed(5)

}

async function startAfterConnected() {

    latestFeeds = await paprika.getPrices()
    latestFeeds['RUBLE'].cer = await getAvgPrice('RUBLE', 'BTS')
    latestFeeds['EUR'].cer = await getAvgPrice('EUR', 'BTS')

    scheduler.scheduleJob("1 */1 * * * *", async () => {
        latestFeeds = await paprika.getPrices()
        latestFeeds['RUBLE'].cer = await getAvgPrice('RUBLE', 'BTS')
        latestFeeds['EUR'].cer = await getAvgPrice('EUR', 'BTS')
    });
}

router.get('/feeds', async function(req, res, next) {
    await res.json(latestFeeds)
});

module.exports = router


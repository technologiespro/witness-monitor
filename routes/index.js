const express = require('express');
const router = express.Router();
const BitShares = require('btsdex');
const jsonFile = require('jsonfile');
const scheduler = require("node-schedule");
const CONFIG = jsonFile.readFileSync('./config.json');
const PriceFeed = require('../modules/pricefeed');

let latestFeeds = {};

BitShares.connect(CONFIG.node);
BitShares.subscribe('connected', startAfterConnected);

console.log('dev mode', CONFIG.dev);

const feed = new PriceFeed({
    BitSharesInstance: BitShares,
    config: CONFIG,
});

async function startAfterConnected() {
    await feed.init();
    latestFeeds = await feed.feelPrices();
}

scheduler.scheduleJob("1 */" + CONFIG.priceFeeds.cron.minute + " * * * *", async () => {
    latestFeeds = await feed.publishAllFeeds();
});


router.get('/feeds', async function (req, res, next) {
    await res.json(latestFeeds)
});


if (CONFIG.dev) {
    router.get('/publish', async function (req, res, next) {
        latestFeeds = await feed.publishAllFeeds();
        await res.json({
            status: 'published',
            data: latestFeeds
        })
    });
}

module.exports = router;

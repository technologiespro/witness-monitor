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

// Recurrence Rule Scheduling
let cronRule = new scheduler.RecurrenceRule();
cronRule.minute = CONFIG.priceFeeds.cron.minute;// 0 - 59
if (CONFIG.priceFeeds.cron.hour) {
  cronRule.hour = CONFIG.priceFeeds.cron.hour;// 0 - 23
}

scheduler.scheduleJob(cronRule, async () => {
  latestFeeds = await feed.publishAllFeeds();
});

if (CONFIG.priceFeeds.assetsMetal.isActive) {
  scheduler.scheduleJob("1 1 21 * * *", async () => {
    await feed.publishMetalFeeds();
  });
}

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

  router.get('/publish-metal', async function (req, res, next) {
    let latestFeedsMetal = await feed.publishMetalFeeds();
    await res.json({
      status: 'published',
      data: latestFeedsMetal
    })
  });

}

module.exports = router;

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

router.get('/feeds', async function (req, res, next) {
  await res.json(latestFeeds)
});


if (CONFIG.dev) {
  router.get('/publish', async function (req, res, next) {
    await feed.publishAllFeeds();
    await res.json({
      status: 'published',
      data: latestFeeds
    })
  });
}

module.exports = router;

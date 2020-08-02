const express = require('express')
const router = express.Router()
const scheduler = require("node-schedule")
const Paprika = require('../providers/coinpaprika')
const paprika = new Paprika()

scheduler.scheduleJob("1 */1 * * * *", async () => {
    console.log(await paprika.getPrices())
});


/* GET home page. */
router.get('/prices', async function(req, res, next) {
    await res.json(await paprika.getPrices())
});

module.exports = router;

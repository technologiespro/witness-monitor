const express = require('express');
const router = express.Router();
const Paprika = require('../providers/coinpaprika');
const paprika = new Paprika();

/* GET home page. */
router.get('/prices', async function(req, res, next) {
    await res.json(await paprika.getPrices());
});

module.exports = router;

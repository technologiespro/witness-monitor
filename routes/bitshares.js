const express = require('express');
const router = express.Router();
const BitShares = require('btsdex')
const jsonFile = require('jsonfile')
const level = require('level')
const db = level('.bitshares', {valueEncoding: 'json'})
const CONFIG = jsonFile.readFileSync('./config.json')

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

async function startAfterConnected() {
    let limit = 2
    let data = await orderBook('RUBLE', 'BTS', limit)
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
}

module.exports = router


const express = require('express');
const router = express.Router();
const BitShares = require('btsdex')
const jsonFile = require('jsonfile')
const level = require('level')
const db = level('.bitshares', {valueEncoding: 'json'})
const CONFIG = jsonFile.readFileSync('./config.json')
BitShares.connect(CONFIG.node)



module.exports = router


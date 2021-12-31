const express = require('express');
const helmet = require('helmet');
const path = require('path');
const cookieParser = require('cookie-parser');
//const logger = require('morgan'); //dev log

const jsonFile = require('jsonfile');
const config = jsonFile.readFileSync('./config.json');

process.env.PORT = config.port;
console.log("Running on port:", process.env.PORT);

const indexRouter = require('./routes/index');
const feedsRouter = config.priceFeeds.isOn ? require('./routes/feeds') : null;

const app = express();
app.use(helmet());

app.disable("x-powered-by");

//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
feedsRouter ? app.use('/feeds', feedsRouter) : null;

module.exports = app;

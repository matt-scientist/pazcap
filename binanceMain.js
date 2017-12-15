'use strict';

//const calculateSpread = require('./scripts/calculate_spread');

require('ts-node').register({ /* options */ });
const cp = require('child_process');
const spawn = cp.spawn;
const fork = cp.fork;

/* Live Book Child Process */

var liveOrderBookChild = spawn('ts-node', ['./scripts/live-order-book.ts']);

liveOrderBookChild.on('error', function(err) {
    console.log('***** !!!!! ***** received error from liveOrderBookChild');
    console.log('err: ', err);
});

// liveOrderBookChild.stdout.on('data', function(data) {
//     console.log('LIVE-ORDER-BOOK: ', data.toString('utf8'));
// });


/* BINANCE BOOK CHILD  */

var binanceBookChild = spawn('node', ['./binance/binanceBook.js']);

binanceBookChild.on('error', function(err) {
    console.log('***** !!!!! ***** received error from binanceBookChild');
    console.log('err: ', err);
});

var binanceBookChild_eth = spawn('node', ['./binance/binanceBook_ETHBTC.js']);

binanceBookChild_eth.on('error', function(err) {
    console.log('***** !!!!! ***** received error from binanceBookChild_eth');
    console.log('err: ', err);
});

// binanceBookChild.stdout.on('data', function(data) {
//     console.log('BINANCE_BOOK: ', data.toString('utf8'));
// });

/* End BINANCE BOOK CHILD  */

/* BINANCE SPREAD CHILD  */

var binanceSpreadChild = spawn('node', ['./scripts/calc_gdax_binance.js']);

binanceSpreadChild.on('error', function(err) {
    console.log('***** !!!!! ***** received error from binanceSpreadChild');
    console.log('err: ', err);
});

binanceSpreadChild.stdout.on('data', function(data) {
    console.log('BINANCE_SPREAD: ', data.toString('utf8'));
});

/* End BINANCE SPREAD CHILD  */

/* CALCULATE SPREAD CHILD  */

// var calculateSpreadChild = spawn('node', ['./scripts/calculate_spread.js']);

// calculateSpreadChild.on('error', function(err) {
//     console.log('***** !!!!! ***** received error from calculateSpreadChild');
//     console.log('err: ', err);
// });
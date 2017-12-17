'use strict';

//const calculateSpread = require('./scripts/calculate_spread');

require('ts-node').register({ /* options */ });
const cp = require('child_process');
const spawn = cp.spawn;
const fork = cp.fork;
var liveOrderBookChild = spawn('ts-node', ['./scripts/gdax-live-order-book.ts']);
var binanceBookChild = spawn(`node ./scripts/binance/binanceBook.js`, [], { shell: true });
var binanceSpreadChild = spawn('node', ['./scripts/binance/calc_gdax_binance.js']);

const children = [liveOrderBookChild, binanceBookChild, binanceSpreadChild];

init(children);

function init (children) {
	for(var i = 0; i < children.length; i++) {
		children[i].on('error', function(err) {
	    	console.log('***** !!!!! ***** received error');
	    	console.log('err: ', err);
		});
		children[i].stdout.on('data', function(data) {
		    console.log(data.toString('utf8'));
		});
	}
}

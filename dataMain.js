'use strict';

require('ts-node').register({ /* options */ });
const cp = require('child_process');
const spawn = cp.spawn;
var liveOrderBookChild = spawn('ts-node', ['./scripts/data-management/gdax-live-order-book.ts']);
var binanceBookChild = spawn(`node ./scripts/data-management/binanceBook.js`, [], { shell: true });
var spreadChild = spawn('node', ['./scripts/data-management/cross_exchange_spread.js']);

const children = [liveOrderBookChild, binanceBookChild, spreadChild];

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

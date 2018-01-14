'use strict';

require('ts-node').register({ /* options */ });
const cp = require('child_process');
const spawn = cp.spawn;


let param = process.argv.slice(2)[0];
console.log(param);

var binanceBookChild = spawn(`node ./scripts/data-management/binanceBook.js`, [param], { shell: true });
var liveOrderBookChild = spawn(`ts-node ./scripts/data-management/gdax-live-order-book.ts`, [param], { shell: true });
var spreadChild = spawn(`node ./scripts/data-management/cross_exchange_spread.js`, [param], { shell: true });

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

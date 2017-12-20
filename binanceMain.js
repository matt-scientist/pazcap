'use strict';

require('ts-node').register({ /* options */ });
const cp = require('child_process');
const spawn = cp.spawn;
var socketChild = spawn('node', ['./scripts/binance/gdax-websocket.js']);
//var mgmtChild = spawn('node', ['./scripts/binance/order_management.js']);
//var orderChild = spawn('node', ['./scripts/binance/order_place.js']);


const children = [socketChild];

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

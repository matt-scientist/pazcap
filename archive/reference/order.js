var fs = require("fs");
const Gdax = require('gdax');

// function Order (side, prod, type, size, price) {
// 	this.side = side;
// 	this.prod = prod;
//     this.type = type;
//     this.size = size;
//     this.price = price;
//     this.getInfo = function() {
//         return this.side + ' ' + this.prod + ' ' + this.type + ' ' + this.size + ' ' + this.price;
//     };
// }

// var test_order = new Order('buy', 'LTCUSD', 'limit', 1, 256.01);

//console.log(test_order.getInfo());

var api_key = require("secrets/secret.json");

const key = api_key["key"];
const b64secret = api_key["secret"];
const passphrase = api_key["pass"];
const apiURI = 'https://api.gdax.com';

const authedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);

// authedClient.getAccounts(function(err, response, accounts) {
// 	 console.log(accounts);
// });

const args = {
	price: '.0004',
	size: '1',
	product_id: 'LTC-BTC'
};

getOrders(function(orders) {
	console.log(orders);
	var orderId = orders[0].id
	console.log("cancelling order: ", orderId);
	cancelOrder(orderId);
});

function cancelOrder(orderId) {
	authedClient.cancelOrder(orderId, function(err, response, result) {

		if (err) {
			console.log(err);
			return;
		}

		console.log(result);
	})
}

function placeOrder(args) {
	authedClient.buy(args, function(err, response, data) {
		if (err) {
			console.log(err);
			return;
		}

		console.log(data);
	});
}

function getOrders(callback) {
	authedClient.getOrders(function(err, response, orders) {
		if (err) {
			console.log(err);
			return;
		}

		if (orders.length === 0){
			console.log('you have no orders');
			return;
		}

		callback(orders);
	});
}



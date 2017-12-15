const binance = require('node-binance-api');
const secret = require('../secrets/secret_binance');

console.log("secret: ", secret.secret);

binance.options({
    'APIKEY':secret.key,
    'APISECRET': secret.secret
});

//limitBuy("LTCBTC", 0.5, 0.01)

findOpenOrders("LTCBTC", function(orders) {
	var orderId = orders[0].orderId;
	console.log("orderId: ", orderId);
	cancelOrder("LTCBTC", orderId);
});


function limitBuy(product, quantity, price) {
	binance.buy(product, quantity, price);
}

function marketBuy(product, quantity) {
	binance.buy(product, quantity);
}

function cancelOrder(product, orderId) {
	binance.cancel(product, orderId, function(response, symbol) {
		console.log(symbol+" cancel response:", response);
	});
}

function findOpenOrders(product, callback) {
	binance.openOrders(product, function(openOrders, symbol) {
		console.log("openOrders("+symbol+")", openOrders);
		callback(openOrders);
	});
}
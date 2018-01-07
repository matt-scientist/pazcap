var api_key = require("../../secrets/secret.json");
const Gdax = require('gdax');

const key = api_key["key"];
const b64secret = api_key["secret"];
const passphrase = api_key["pass"];
const apiURI = 'https://api.gdax.com';

const gdaxAuthedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);

module.exports.limitSellGdax = (args) => {
	gdaxAuthedClient.sell(args, function(err, response, data) {
		if (err) {
			console.log('gdax err: ' + err);
			return;
		}

		console.log(data);
	});
}

module.exports.getOrdersGdax = (callback) => {
    gdaxAuthedClient.getOrders(function(err, response, orders) {
        if (err) {
            console.log('gdax err: ' + err);
            return;
        }

        if (orders.length === 0){
            console.log('you have no orders');
        }

        callback(orders);
    });
}

module.exports.cancelOrderGdax = (orderId) => {
    gdaxAuthedClient.cancelOrder(orderId, function(err, response, result) {

        if (err) {
            console.log('gdax err: ' + err);
            return;
        }

        console.log('CANCELLED');

        console.log(result);
    })
}

module.exports.getAccountsGdax = (callback) => {
    gdaxAuthedClient.getAccounts(function(err, response, orders) {
        if (err) {
            console.log(err);
            return;
        }

        callback(orders);
    });
}

module.exports.getAccountGdax = (id, callback) => {
    
gdaxAuthedClient.getAccount(id, function(err, response, acct) {

        if (err) {
            console.log(err);
            return;
        }

        callback(acct);
     });
}
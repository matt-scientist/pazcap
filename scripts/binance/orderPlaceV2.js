const binance = require('node-binance-api');
const secret = require('../../secrets/secret_binance');
var fs = require("fs");
const Gdax = require('gdax');
var api_key = require("../../secrets/secret.json");

binance.options({
    'APIKEY':secret.key,
    'APISECRET': secret.secret
});

const key = api_key["key"];
const b64secret = api_key["secret"];
const passphrase = api_key["pass"];
const apiURI = 'https://api.gdax.com';

const gdaxAuthedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);

marketBuyBinance("LTCBTC", 0.0);

function marketBuyBinance(product, quantity) {
	console.log("Binance market buy with: ", product)
	console.log("quantity: ", quantity);
	binance.marketBuy(product, quantity, function(response) {
		console.log("Market Buy response: ", response);
		console.log("order id: " + response.orderId);

		fs.readFile ("./db/LTC-BTC.json", 'utf8', function (error, data) {
            if (error) {
                console.log("read error: ", error);
            }

            var ltcBtcBestAsk = Number(JSON.parse(data).bestAsk);

            const args = {
				price: ltcBtcBestAsk,
				size: quantity,
				product_id: 'LTC-BTC'
			};

			limitSellGdax(args);
        });
	});
}

function limitSellGdax(args) {
	gdaxAuthedClient.sell(args, function(err, response, data) {
		if (err) {
			console.log(err);
			return;
		}

		console.log(data);
	});
}
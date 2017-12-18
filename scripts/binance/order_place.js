const binance = require('node-binance-api');
const secret = require('../../secrets/secret_binance');
var fs = require("fs");
const Gdax = require('gdax');
var api_key = require("../../secrets/secret.json");
var rsvp = require('rsvp');

binance.options({
    'APIKEY':secret.key,
    'APISECRET': secret.secret
});

const key = api_key["key"];
const b64secret = api_key["secret"];
const passphrase = api_key["pass"];
const apiURI = 'https://api.gdax.com';

let anyOrders = false;

const gdaxAuthedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);


setInterval(function() {
    getOrders(function() {
        console.log("anyOrders: ", anyOrders)
        if (anyOrders === false) {
            console.log("attempting to place order");
            execute();
        }
        else {
            console.log('orders already exist, not placing another');
        }
    })
}, 2073);

function execute() {
    var loadFile = function (path) {
        return new rsvp.Promise(function (resolve, reject) {
            fs.readFile (path, 'utf8', function (error, data) {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        });
    };

var promises = ['./db/gdax/LTC-BTC.json', './db/binance/LTC-BTC.json', './db/spreads/LTC-BTC_gdax_binance.json'].map(loadFile);

rsvp.all(promises).then(function(files) {

	let gdax = JSON.parse(files[0]);
	let binance = JSON.parse(files[1]);
	let spread = JSON.parse(files[2]);

	// console.log("GDAX Best Ask, Size: ", gdax.bestAskPrice, gdax.bestAskSize);

	// console.log("Binance Best Ask, Size: ", binance.bestAskPrice, binance.bestAskSize);

    const sizeLimit = 0.1;


    if ((binance.bestAskSize >= sizeLimit) && (spread.pasSell_actBuy > 0)) {
    	console.log("quoting GDAX for PS_AB");

    	const args = {
				price: gdax.bestAskPrice,
				size: sizeLimit,
				product_id: 'LTC-BTC'
		};

		limitSellGdax(args);
    }
    else {
        console.log('order not placed due to size or spread');
    }



    }).catch(function(reason) {
        console.log(reason); // something went wrong...
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

function getOrders(callback) {
    gdaxAuthedClient.getOrders(function(err, response, orders) {
        if (err) {
            console.log(err);
            return;
        }

        if (orders.length === 0){
            anyOrders = false;
        }

        if (orders.length > 0) {
            anyOrders = true;
        }

        callback(orders);
    });
}


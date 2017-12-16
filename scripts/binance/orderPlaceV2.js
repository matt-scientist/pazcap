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

const gdaxAuthedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);

execute();

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

var promises = ['./db/LTC-BTC.json', './binance_db/ltcbtc_ask.json', './binance_db/spread_LTCBTC.txt'].map(loadFile);

rsvp.all(promises).then(function(files) {

	let gdax_ltcbtc = JSON.parse(files[0]);
	let binance_ltcbtc_ask = JSON.parse(files[1]);
	let spread_ltcbtc = files[2];

	console.log("GDAX Best Ask: ", gdax_ltcbtc.bestAsk);

	console.log("Binance Best Ask: ", binance_ltcbtc_ask.price);

    const sizeLimit_ltc = 0.1;
    console.log("SPREAD" + spread_ltcbtc);

    if ((binance_ltcbtc_ask.size >= sizeLimit_ltc) && (spread_ltcbtc > 0)) {
    	console.log("quoting GDAX");

    	const args = {
				price: gdax_ltcbtc.bestAsk,
				size: sizeLimit_ltc,
				product_id: 'LTC-BTC'
		};

		limitSellGdax(args);
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


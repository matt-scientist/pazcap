const binance = require('node-binance-api');
const binance = require('node-binance-api');
const secret = require('../secrets/secret_binance');
var fs = require("fs");
const Gdax = require('gdax');
var api_key = require("../secrets/secret.json");
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


function getBinanceBalances(callback) {
binance.balance(function(balances) {
	//console.log("balances()", balances);
	//console.log('Binance Balances');
	//console.log("BTC balance: ", balances.BTC.available);
	//console.log("LTC balance: ", balances.LTC.available);

    callback(balances);
});
}

const BTC_accountID = '05a0a3a3-7b97-42ec-a9f3-976aa7e68281';
const LTC_accountID = '0f6a825b-39ab-45a2-964d-dee5781e9f31';
const exchange0 = 'gdax';
const exchange1 = 'binance';

getAccount(BTC_accountID, function(data0) {
	//console.log('GDAX Balances');
	//console.log(data0.currency, ' ', data0.balance);

    getBinanceBalances(function(binance_balance) {

    //console.log(binance_balance.BTC.available);


	getAccount(LTC_accountID, function(data) {

		//console.log(data.currency, ' ', data.balance);
        //console.log(data0);

        //SAVE to .json

        var balances = JSON.stringify({

            gdax_btc: (data0.balance), 
            gdax_ltc: (data.balance), 
            binance_btc: (binance_balance.BTC.available),
            binance_ltc: (binance_balance.LTC.available),

    });
        new Date();

        //console.log(String(Date.now()));

        //console.log(balances);

        fs.writeFileSync('./db/balances/'+ String(Date.now()) + '_' +  exchange0 + '_' + exchange1 + '.json', balances);

	});

});
});

//DEPRECATED


const startfile = './db/balances/1515033880277_gdax_binance.json';
const endfile = './db/balances/1515034556743_gdax_binance.json';

calculateBalances(startfile, endfile);

function calculateBalances(snapshotjson_start, snapshotjson_end) {

    var promises = [startfile, endfile].map(loadFile);

    rsvp.all(promises).then(function(files) {

        //console.log(files);

        snapshotjson_start = files[0];
        snapshotjson_end = files[1];

        //works
        //console.log(JSON.parse(snapshotjson_start).gdax_btc);

        const gdax_btc_start = JSON.parse(snapshotjson_start).gdax_btc;
        const gdax_ltc_start = JSON.parse(snapshotjson_start).gdax_ltc;
        const bin_btc_start = JSON.parse(snapshotjson_start).binance_btc;
        const bin_ltc_start = JSON.parse(snapshotjson_start).binance_ltc;

        const gdax_btc_end = JSON.parse(snapshotjson_end).gdax_btc;
        const gdax_ltc_end = JSON.parse(snapshotjson_end).gdax_ltc;
        const bin_btc_end = JSON.parse(snapshotjson_end).binance_btc;
        const bin_ltc_end = JSON.parse(snapshotjson_end).binance_ltc;

        console.log('Net BTC: ', (gdax_btc_end - gdax_btc_start) - (bin_btc_start - bin_btc_end));
        console.log('Net LTC: ', (bin_ltc_end - bin_ltc_start) - (gdax_ltc_start - gdax_ltc_end));

    });

    /*let gdax_btc_start = Number(JSON.parse(snapshotjson_start.gdax_btc));
    let gdax_ltc_start = Number(JSON.parse(snapshotjson_start.gdax_ltc));
    let bin_btc_start = Number(JSON.parse(snapshotjson_start.binance_btc));
    let bin_ltc_start = Number(JSON.parse(snapshotjson_start.binance_ltc));

    let gdax_btc_end = Number(JSON.parse(snapshotjson_end.gdax_btc));
    let gdax_ltc_end = Number(JSON.parse(snapshotjson_end.gdax_ltc));
    let bin_btc_end = Number(JSON.parse(snapshotjson_end.binance_btc));
    let bin_ltc_end = Number(JSON.parse(snapshotjson_end.binance_ltc));

    console.log('Net BTC: ', (gdax_btc_end - gdax_btc_start) - (bin_btc_start - bin_btc_end));
    console.log('Net LTC: ', (bin_ltc_end - bin_ltc_start) - (gdax_ltc_start - gdax_ltc_end));*/
}

//TODO, read this from the .txt or .json

function getAccount(id, callback) {
	
gdaxAuthedClient.getAccount(id, function(err, response, acct) {

		if (err) {
            console.log(err);
            return;
        }

     	//console.log(acct);
     	callback(acct);
     });
}

function getAccounts(callback) {
    gdaxAuthedClient.getAccounts(function(err, response, orders) {
        if (err) {
            console.log(err);
            return;
        }

        callback(orders);
    });
}

function loadFile (path) {
        return new rsvp.Promise(function (resolve, reject) {
            fs.readFile (path, 'utf8', function (error, data) {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        });
    };
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

binance.balance(function(balances) {
	//console.log("balances()", balances);
	console.log("LTC balance: ", balances.LTC.available);
	console.log("BTC balance: ", balances.BTC.available);
});
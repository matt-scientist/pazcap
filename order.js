var fs = require("fs");
const Gdax = require('gdax');

function Order (side, prod, type, size, price) {
	this.side = side;
	this.prod = prod;
    this.type = type;
    this.size = size;
    this.price = price;
    this.getInfo = function() {
        return this.side + ' ' + this.prod + ' ' + this.type + ' ' + this.size + ' ' + this.price;
    };
}

var test_order = new Order('buy', 'LTCUSD', 'limit', 1, 256.01);

console.log(test_order.getInfo());

var api_key = require("secrets/secret.json");

const key = api_key["key"];
const b64secret = api_key["secret"];
const passphrase = api_key["pass"];
const apiURI = 'https://api.gdax.com';

const authedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);
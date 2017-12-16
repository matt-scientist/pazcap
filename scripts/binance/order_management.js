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


setInterval(function() {
    execute('LTC-BTC');
}, 2000);

function execute(product) {
    getOrders(function(orders) {
    //console.log(orders);

    fs.readFile ("./binance_db/spread_" + product + ".txt", 'utf8', function (error, data) {
            if (error) {
                console.log("read error: ", error);
            }

            console.log("SPREAD: " + data);

            if (data < 0) {
                for(var i = 0; i < orders.length; i++) {
                    if (orders[i].product_id === product){
                        cancelOrder(orders[i].id);
                    }
                }
            }

        });
    });
}



function getOrders(callback) {
    gdaxAuthedClient.getOrders(function(err, response, orders) {
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


function cancelOrder(orderId) {
    gdaxAuthedClient.cancelOrder(orderId, function(err, response, result) {

        if (err) {
            console.log(err);
            return;
        }

        console.log('CANCELLED');

        console.log(result);
    })
}
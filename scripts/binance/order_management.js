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

setInterval(function() {
    execute('LTC-BTC');
}, 2000);

function execute(product) {

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

var promises = ['./db/gdax/LTC-BTC.json', './db/spreads/LTC-BTC_gdax_binance.json'].map(loadFile);

    rsvp.all(promises).then(function(files) {
        getOrders(function(orders) {

            let gdaxFile = JSON.parse(files[0]);
            let spreadFile = JSON.parse(files[1]);
            // console.log("SPREAD: " + spreadFile.pasSell_actBuy);


            if (spreadFile.pasSell_actBuy < 0) {
                for(var i = 0; i < orders.length; i++) {
                    if (orders[i].product_id === product){
                        cancelOrder(orders[i].id);
                    }
                }
            }

            for (var i = 0; i < orders.length; i++) {
                if (orders[i].price > gdaxFile.bestAskPrice) {
                    console.log('front-runned for order: ', orders[i].id);
                    cancelOrder(orders[i].id);
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
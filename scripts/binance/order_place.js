var fs = require("fs");
var rsvp = require('rsvp');
const authedBinance = require('../utility/binance_methods');
const { loadFile } = require('../utility/load_file');
const { limitSellGdax, getOrdersGdax } = require('../utility/gdax_methods');

setInterval(function() {
    getOrdersGdax(function(orders) {
        if (orders.length === 0) {
            console.log("attempting to place order");

            execute('LTC-BTC');
        }
        else {
            console.log('orders already exist, not placing another');
        }
    })
}, 4073);


function execute(product) {

var promises = ['./db/gdax/' + product + '.json', './db/binance/' + product + '.json', './db/spreads/' + product + '_gdax_binance.json'].map(loadFile);

rsvp.all(promises).then(function(files) {

	let gdax = JSON.parse(files[0]);
	let binance = JSON.parse(files[1]);
	let spread = JSON.parse(files[2]);

    const sizeLimit = 0.01;


    if ((binance.bestAskSize >= sizeLimit) && (spread.pasSell_actBuy > 0)) {

        authedBinance.balance(function(balances) {
            console.log('available BTC on binance:' + balances.BTC.available);
            if (balances.BTC.available >= (sizeLimit * binance.bestAskPrice)) {
                console.log("quoting GDAX for PS_AB");

                const args = {
                        price: gdax.bestAskPrice,
                        size: sizeLimit,
                        product_id: product
                };

                limitSellGdax(args);
            }
        });

    }
    else {
        console.log('order not placed due to size or spread');
    }

    }).catch(function(reason) {
        console.log(reason); // something went wrong...
    });    
}


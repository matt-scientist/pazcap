var rsvp = require('rsvp');
const { loadFile } = require('../utility/load_file');
const { getOrdersGdax, cancelOrderGdax, limitSellGdax } = require('../utility/gdax_methods');
const binance = require('../utility/binance_methods');

let param = process.argv.slice(2)[0];

let product = param;

execute(product.toString());

function execute(product) {


var promises = ['./db/gdax/' + product + '.json', './db/spreads/' + product + '_gdax_binance.json', './db/binance/' + product + '.json'].map(loadFile);

rsvp.all(promises).then(function(files) {
        getOrdersGdax(function(orders) {
            console.log('into function' + JSON.stringify(promises));

            let gdaxFile = JSON.parse(files[0]);
            let spreadFile = JSON.parse(files[1]);
            let binanceFile = JSON.parse(files[2]);

            const size = 1.0;

            console.log('Size: ', size);

            if (spreadFile.actSell_actBuy > 0 && gdaxFile.bestBidSize > size && binanceFile.bestAskSize > size) {
            	console.log('Active active firing');

            	binance.marketBuy('LTCBTC', size, function(response) {

	  				console.log("Binance Market Buy response: ", response);
	  				console.log("order id: " + response.orderId);
	  				if (response.status === 'FILLED') {
	  					const args = {
							type: 'market',
							size: size,
							product_id: 'LTC-BTC'
						};

						console.log("Market Sell Firing on GDAX")

						limitSellGdax(args);
	  				}

				});

            }

        });
    });

}

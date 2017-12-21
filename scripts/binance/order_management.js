var rsvp = require('rsvp');
const { loadFile } = require('../utility/load_file');
const { getOrdersGdax, cancelOrderGdax } = require('../utility/gdax_methods');


setInterval(function() {
    execute('LTC-BTC');
}, 2000);

function execute(product) {

var promises = ['./db/gdax/' + product + '.json', './db/spreads/' + product + '_gdax_binance.json'].map(loadFile);

    rsvp.all(promises).then(function(files) {
        getOrdersGdax(function(orders) {
            console.log('into function' + JSON.stringify(promises));

            let gdaxFile = JSON.parse(files[0]);
            let spreadFile = JSON.parse(files[1]);


            if (spreadFile.pasSell_actBuy < 0) {
                for(var i = 0; i < orders.length; i++) {
                    if (orders[i].product_id === product){
                        cancelOrderGdax(orders[i].id);
                    }
                }
            }

            for (var i = 0; i < orders.length; i++) {
                if (orders[i].price > gdaxFile.bestAskPrice) {
                    console.log('front-runned for order: ', orders[i].id);
                    cancelOrderGdax(orders[i].id);
                }
            }

        });
    });
}
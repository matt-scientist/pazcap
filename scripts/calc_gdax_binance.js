var fs = require('fs');
var rsvp = require('rsvp');

setInterval(function() {
    execute()
}, 5000);


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

var promises = ['./db/LTC-BTC.json', './binance_db/ltcbtc_ask.json'].map(loadFile);

rsvp.all(promises).then(function(files) {

    var ltc_btc_binance_gdax = Number(JSON.parse(files[0]).midprice) - Number(JSON.parse(files[1]).price);
    console.log("ltc_btc_binance_gdax" + ltc_btc_binance_gdax);

    }).catch(function(reason) {
        console.log(reason); // something went wrong...
    });    
}

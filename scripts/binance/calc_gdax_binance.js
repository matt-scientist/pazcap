var fs = require('fs');
var rsvp = require('rsvp');

setInterval(function() {
    execute()
}, 5000);

const filesToLoad = ['./db/LTC-BTC.json', './binance_db/LTC-BTC.json'];

function execute(files) {
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

var promises = filesToLoad.map(loadFile);

rsvp.all(promises).then(function(files) {

    var ltc_btc_binance_gdax = Number(JSON.parse(files[0]).bestAskPrice) - (Number(JSON.parse(files[1]).bestAskPrice) * 1.01);

    fs.writeFileSync('./binance_db/spread_LTC-BTC.txt', ltc_btc_binance_gdax);

    console.log('|________________________________________________________|')
    console.log("SPREAD: LTC_BTC_GDAX-BINANCE " + ltc_btc_binance_gdax);
    console.log('|________________________________________________________|')
    //console.log("eth_btc_binance_gdax " + eth_btc_binance_gdax);


    }).catch(function(reason) {
        console.log(reason); // something went wrong...
    });    
}

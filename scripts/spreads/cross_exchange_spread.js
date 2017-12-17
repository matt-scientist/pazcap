var fs = require('fs');
var rsvp = require('rsvp');

let exchange0 = {
    name: 'gdax',
    limitFee: 0,
    marketFee: .0025

}

let exchange1 = {
    name: 'binance',
    limitFee: .001,
    marketFee: .001
}

let product = 'LTC-BTC';

setInterval(function() {
    execute(exchange0, exchange1, product);
}, 4000);

function execute(exchange0, exchange1, product) {

const filesToLoad = [
    './db/' + exchange0.name + '/' + product + '.json', 
    './db/' + exchange1.name + '/' + product + '.json'
];

var promises = filesToLoad.map(loadFile);

rsvp.all(promises).then(function(files) {

    const spread = {
        passiveSell_activeBuy: ((Number(JSON.parse(files[0]).bestAskPrice) * exchange0.limitFee) - (Number(JSON.parse(files[1]).bestAskPrice) * exchange1.marketFee)), 
        activeBuy_passiveSell: ((Number(JSON.parse(files[0]).bestAskPrice) * exchange0.marketFee) - (Number(JSON.parse(files[1]).bestAskPrice) * exchange1.limitFee)),
        activeSell_passiveBuy: ((Number(JSON.parse(files[0]).bestBidPrice) * exchange0.marketFee) - (Number(JSON.parse(files[1]).bestBidPrice) * exchange1.limitFee)),
        passiveBuy_activeSell: ((Number(JSON.parse(files[0]).bestBidPrice) * exchange0.limitFee) - (Number(JSON.parse(files[1]).bestBidPrice) * exchange1.marketFee)),
        activeSell_activeBuy: ((Number(JSON.parse(files[0]).bestBidPrice) * exchange0.marketFee) - (Number(JSON.parse(files[1]).bestAskPrice) * exchange1.marketFee)), 
        activeBuy_activeSell: ((Number(JSON.parse(files[0]).bestAskPrice) * exchange0.marketFee) - (Number(JSON.parse(files[1]).bestBidPrice) * exchange1.marketFee)),
    };

    fs.writeFileSync('./db/spreads/' + product + '_' + exchange0 + '_' + exchange1, spread);

    console.log('|________________________________________________________|')
    console.log(exchange0.name, exchange1.name);
    console.log(spread);
    console.log('|________________________________________________________|')


    }).catch(function(reason) {
        console.log(reason); // something went wrong...
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
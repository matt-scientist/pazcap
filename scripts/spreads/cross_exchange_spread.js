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

    let exch0_ask = Number(JSON.parse(files[0]).bestAskPrice);
    let exch0_bid = Number(JSON.parse(files[0]).bestBidPrice);

    let exch1_ask = Number(JSON.parse(files[1]).bestAskPrice);
    let exch1_bid = Number(JSON.parse(files[1]).bestBidPrice);

    const spread = {
        //NOTE: EXCHANGE_0 is the QUOTE, EXCHANGE 1 is the MARKET ORDER - Assume Passive - Active or Active Active
        pasSell_actBuy: ((exch0_ask*(1-exchange0.limitFee)) - (exch1_ask*(1+exchange1.marketFee))), 
        actSell_actBuy: ((exch0_bid*(1-exchange0.marketFee)) - (exch1_ask*(1+exchange1.marketFee))), 

        pasBuy_actSell: ((exch0_bid*(1+exchange0.limitFee)) - (exch1_bid*(1-exchange1.marketFee))),
        actBuy_actSell: ((exch0_ask*(1+exchange0.marketFee)) - (exch1_bid*(1-exchange1.marketFee))), 

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


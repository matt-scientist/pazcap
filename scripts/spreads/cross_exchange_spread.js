var fs = require('fs');
const { loadFile } = require('../utility/load_file');
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

    var spread = JSON.stringify({
        //NOTE: EXCHANGE_0 is the QUOTE, EXCHANGE 1 is the MARKET ORDER - Assume Passive - Active or Active Active
        pasSell_actBuy: ((exch0_ask*(1-exchange0.limitFee)) - (exch1_ask*(1+exchange1.marketFee))), //sell0 buy1
        actSell_actBuy: ((exch0_bid*(1-exchange0.marketFee)) - (exch1_ask*(1+exchange1.marketFee))), 

        pasBuy_actSell: (-1*((exch0_bid*(1+exchange0.limitFee)) - (exch1_bid*(1-exchange1.marketFee)))), //buy0 sell1
        actBuy_actSell: (-1*((exch0_ask*(1+exchange0.marketFee)) - (exch1_bid*(1-exchange1.marketFee)))), 

    });

    fs.writeFileSync('./db/spreads/' + product + '_' + exchange0.name + '_' + exchange1.name + '.json', spread);

    console.log('|________________________________________________________|')
    console.log(exchange0.name, exchange1.name);
    console.log(spread);
    console.log('|________________________________________________________|')


    }).catch(function(reason) {
        console.log(reason); // something went wrong...
    });    
}


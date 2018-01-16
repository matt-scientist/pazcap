'use strict';

const Kucoin = require('kucoin-api');
var secret = require("../../secrets/secret_kucoin.json");

let kc = new Kucoin(secret.key, secret.secret);


//getBalances();

function getBalances() {
    return new Promise((resolve, reject) => {
        kc.getBalance().then(result => {
            console.log(result);
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    })
}
//
// kc.getOrderBooks({
//     pair: 'POWR-BTC'
// }).then(result => {
//
//     const data = result.data;
//     const sell = data.SELL;
//     const buy = data.BUY;
//     console.log("data: ", data);
//
//     }).catch(console.error);
//

calculateSpread();


function calculateSpread(baseProduct) {

    kc.getExchangeRates().then(result => {
        const data = result.data;
        const currencies = data.currencies;
        console.log("currencies: ", currencies);
        const rates = data.rates;
        console.log("rates: ", rates);
    }).catch(console.error)

}



function buy(args) {
    return new Promise((resolve, reject) => {
        kc.createOrder(args).then(result => {
            console.log("result: ", result);
        }).catch(err => {
            console.log("err: ", err);
        });
    });
}



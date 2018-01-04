'use strict';

const Kucoin = require('kucoin-api');
var secret = require("../../secrets/secret_kucoin.json");

let kc = new Kucoin(secret.key, secret.secret);

function getBalances() {
    return new Promise((resolve, reject) => {
        kc.getBalance().then(result => {
            resolve(result);
        }).catch(err => {
            reject(err);
        });
    })
}

kc.getOrderBooks({
    pair: 'POWR-BTC'
}).then(console.log).catch(console.error);


function buy(args) {
    return new Promise((resolve, reject) => {
        kc.createOrder(args).then(result => {
            console.log("result: ", result);
        }).catch(err => {
            console.log("err: ", err);
        });
    });
}


// kc.getExchangeRates({symbols: ['NEO','GAS']}).then(result => {
//     console.log("result.data: ", result.data);
// }).catch(console.error);
//
// 

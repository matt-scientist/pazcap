'use strict';

const Kucoin = require('kucoin-api');
var secret = require("../../secrets/secret_kucoin.json");

let kc = new Kucoin(secret.key, secret.secret);

/* BALANCES */

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

/* ORDER BOOK */

getOrderBook('LTC-BTC');

function getOrderBook(product) {
    kc.getOrderBooks({
        pair: product
    }).then(result => {

        const data = result.data;
        const sell = data.SELL;
        const buy = data.BUY;

        const bestAsk = sell[sell.length-1];
        const bestBid = buy[0];

        console.log("sell: ", sell);
        console.log("buy: ", buy);

        console.log("bestAsk: ", bestAsk);
        console.log("bestBuy: ", bestBid)



    }).catch(console.error);
}

/* ORDER FUNCTIONS */

function buy(args) {
    return new Promise((resolve, reject) => {
        kc.createOrder(args).then(result => {
            console.log("result: ", result);
        }).catch(err => {
            console.log("err: ", err);
        });
    });
}



'use strict';

const Kucoin = require('kucoin-api');
const fs = require('fs');
const secret = require("../../secrets/secret_kucoin.json");

let kc = new Kucoin(secret.key, secret.secret);

module.exports = {
    execute: execute
};

/* EXECUTE */
function execute(product, filename) {

    console.log("Starting Kucoin order book for: ", product);

    setInterval(function() {
        getOrderBook(product, filename);
    }, 1000);
}


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

function getOrderBook(product, filename) {
    kc.getOrderBooks({
        pair: product
    }).then(result => {

        const data = result.data;
        const sell = data.SELL;
        const buy = data.BUY;

        const bestAsk = sell[sell.length-1];
        const bestBid = buy[0];

        // console.log("sell: ", sell);
        // console.log("buy: ", buy);
        //
        // console.log("bestAsk: ", bestAsk);
        // console.log("bestBid: ", bestBid);

        const bestAskPrice = bestAsk[0];
        const bestAskSize = bestAsk[1];

        const bestBidPrice = bestBid[0];
        const bestBidSize = bestBid[1];

        fs.writeFileSync(filename, JSON.stringify({
            product: product,
            bestAskPrice: bestAskPrice,
            bestAskSize: bestAskSize,
            bestBidPrice: bestBidPrice,
            bestBidSize: bestBidSize
        }));
        console.log("kucoinBook wrote to " + filename);
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



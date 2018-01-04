'use strict';

var bittrex = require('node-bittrex-api');
var secret = require("../../secrets/secret_bittrex.json");

console.log("secret: ", secret);

bittrex.options({
    'apikey' : secret.key,
    'apisecret' : secret.secret,
});

module.exports = {
    getBalances: getBalances,
    constructArgs: constructArgs,
    sell: sell,
    buy: buy
};

function getBalances(callback) {
    bittrex.getbalances( function( data, err ) {
        callback(data);
    });
}

function constructArgs(product, orderType, size, price) {
    return {
        MarketName: product,
        OrderType: orderType,
        Quantity: size,
        Rate: price || 0.0,
        TimeInEffect: 'GOOD_TIL_CANCELLED', // supported options are 'IMMEDIATE_OR_CANCEL', 'GOOD_TIL_CANCELLED', 'FILL_OR_KILL'
        ConditionType: 'NONE', // supported options are 'NONE', 'GREATER_THAN', 'LESS_THAN'
        Target: 0
    }
}

function sell(args, callback) {
    bittrex.tradesell(args, function( data, err ) {
        callback(data)
    });
}

function buy(args, callback) {
    bittrex.tradebuy(args, function( data, err ) {
        callback(data)
    });
}

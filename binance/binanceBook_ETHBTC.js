const binance = require('node-binance-api');
const secret = require('../secrets/secret_binance');
var fs = require('fs');

binance.options({
    'APIKEY':secret.key,
    'APISECRET': secret.secret
});

binance.websockets.depthCache(['ETHBTC'], function(symbol, depth) {
    let bids = binance.sortBids(depth.bids);
    let asks = binance.sortAsks(depth.asks);
    let bidsKey = binance.first(bids);
    let asksKey = binance.first(asks);
    let bestBidsSize = bids[bidsKey];
    let bestAsksSize = asks[asksKey];
    let bidsString = "best bid: " + bidsKey + " size: " + bestBidsSize;
    let asksString = "best ask: " + asksKey + " size: " + bestAsksSize;

    var bidFilename = './binance_db/ethbtc_bid.json';
    var askFilename = './binance_db/ethbtc_ask.json';

    // console.log(bidsString);
    // console.log(asksString);
    console.log("binanceBook wrote" + asksString);

    let adjustedAskPrice = asksKey * 1.01;

    let bidsObject = {
        price: bidsKey,
        size: bestAsksSize
    };

    let asksObject = {
        price: adjustedAskPrice,
        size: bestAsksSize
    };

    fs.writeFileSync(bidFilename, JSON.stringify(bidsObject));
    fs.writeFileSync(askFilename, JSON.stringify(asksObject));
});

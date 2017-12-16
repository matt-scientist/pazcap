const binance = require('node-binance-api');
const secret = require('../../secrets/secret_binance');
var fs = require('fs');

binance.options({
    'APIKEY':secret.key,
    'APISECRET': secret.secret
});

const products = ['LTCBTC', 'ETCBTC'];

var param = process.argv.slice(2)[0];

if (param) {
    setUpBinanceBook(param);
}
else {
    setUpBinanceBook(products[0]);
}

function setUpBinanceBook (product) {
    binance.websockets.depthCache([product], function(symbol, depth) {
    let bids = binance.sortBids(depth.bids);
    let asks = binance.sortAsks(depth.asks);
    let bidsKey = binance.first(bids);
    let asksKey = binance.first(asks);
    let bestBidsSize = bids[bidsKey];
    let bestAsksSize = asks[asksKey];
    let bidsString = "best bid: " + bidsKey + ", size: " + bestBidsSize;
    let asksString = "best ask: " + asksKey + ", size: " + bestAsksSize;
    var bidFilename = './binance_db/' + product + '_bid.json';
    var askFilename = './binance_db/' + product + '_ask.json';

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

    console.log("binanceBook wrote " + JSON.stringify(asksObject) + ' to ' + askFilename);
    console.log("binanceBook wrote " + JSON.stringify(bidsObject) + ' to ' + bidFilename);
    });
}


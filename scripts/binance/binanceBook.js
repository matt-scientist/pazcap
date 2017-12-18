const binance = require('node-binance-api');
const secret = require('../../secrets/secret_binance');
var fs = require('fs');

binance.options({
    'APIKEY':secret.key,
    'APISECRET': secret.secret
});

const products = ['LTCBTC', 'ETHBTC'];

var param = process.argv.slice(2)[0];

if (param) {
    setUpBinanceBook(param);
}
else {
    orderBook(products);
}

function orderBook(products) {
     for(var i = 0; i < products.length; i++) {
         setUpBook(products[i]);
     }
 }

 function setUpBook (product) {
     binance.websockets.depthCache([product], function(symbol, depth) {
    let bids = binance.sortBids(depth.bids);
    let asks = binance.sortAsks(depth.asks);
    let bidsKey = binance.first(bids);
    let asksKey = binance.first(asks);
    let bestBidSize = bids[bidsKey];
    let bestAskSize = asks[asksKey];
    let productSliced = product.slice(0, 3) + "-" + product.slice(3);
    let fileName = './db/binance/' + productSliced + '.json';

    fs.writeFileSync(fileName, JSON.stringify({
        product: productSliced,
        bestAskPrice: asksKey,
        bestAskSize: bestAskSize,
        bestBidPrice: bidsKey,
        bestBidSize: bestBidSize
    }));

    //console.log("binanceBook wrote to " + fileName);
    });

 }



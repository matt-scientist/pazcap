const binance = require('../utility/binance_methods');
const { addDash, removeDash } = require('../utility/dash');
var fs = require('fs');

let param = process.argv.slice(2)[0];

const products = [param.toString()];

orderBook(products);

function orderBook(products) {
     for(var i = 0; i < products.length; i++) {
         setUpBook(products[i]);
     }
 }

 function setUpBook (product) {
    binance.websockets.depthCache([removeDash(product)], function(symbol, depth) {
    let bids = binance.sortBids(depth.bids);
    let asks = binance.sortAsks(depth.asks);
    let bidsKey = binance.first(bids);
    let asksKey = binance.first(asks);
    let bestBidSize = bids[bidsKey];
    let bestAskSize = asks[asksKey];
    let fileName = './db/binance/' + product + '.json';

    fs.writeFileSync(fileName, JSON.stringify({
        product: product,
        bestAskPrice: asksKey,
        bestAskSize: bestAskSize,
        bestBidPrice: bidsKey,
        bestBidSize: bestBidSize
    }));

    console.log("binanceBook wrote to " + fileName);
    });

 }



import * as GTT from 'gdax-trading-toolkit';
import { GDAXFeed } from "gdax-trading-toolkit/build/src/exchanges";
import { LiveBookConfig, LiveOrderbook, SkippedMessageEvent } from "gdax-trading-toolkit/build/src/core";

const logger = GTT.utils.ConsoleLoggerFactory({ level: 'debug' });
var fs = require('fs');

// const products: Array<string> = [
// 'BTC-USD', 'BTC-EUR', 'BTC-GBP', 
// 'ETH-USD', 'ETH-BTC', 'ETH-EUR', 
// 'LTC-USD', 'LTC-BTC', 'LTC-EUR'
// ];

const products: Array<string> = [
'LTC-BTC'
];

orderBook(products);

function orderBook(products: Array<string>) {
     for(var i = 0; i < products.length; i++) {
         setUpBook(products[i]);
     }
 }

 function setUpBook(product:string) {
     GTT.Factories.GDAX.FeedFactory(logger, [product]).then((feed: GDAXFeed) => {
         const config: LiveBookConfig = {
             product: product,
             logger: logger
         };
         const book = new LiveOrderbook(config);
         book.on('LiveOrderbook.snapshot', () => {
             setInterval(() => {
                const bestAskPrice = Number(book.state().asks[0].price);
                const bestAskSize = Number(book.state().asks[0].totalSize);
                const bestBidPrice = Number(book.state().bids[0].price);
                const bestBidSize = Number(book.state().bids[0].totalSize);

                 var filename = './db/gdax/' + product + '.json';

                 fs.writeFileSync(filename, JSON.stringify({
                    product: product,
                    bestAskPrice: bestAskPrice,
                    bestAskSize: bestAskSize,
                    bestBidPrice: bestBidPrice,
                    bestBidSize: bestBidSize
                 }));

                 console.log("gdax-live-order-book wrote to " + filename);
             }, 2000);
         });
         book.on('LiveOrderbook.skippedMessage', (details: SkippedMessageEvent) => {
             // On GDAX, this event should never be emitted, but we put it here for completeness
             console.log('SKIPPED MESSAGE', details);
             console.log('Reconnecting to feed');
             feed.reconnect(0);
         });
         book.on('end', () => {
             console.log('Orderbook closed');
         });
         book.on('error', (err) => {
             console.log('Livebook errored: ', err);
             feed.pipe(book);
         });
         feed.pipe(book);
     });
 }

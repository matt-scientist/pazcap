import * as GTT from 'gdax-trading-toolkit';
import { GDAXFeed } from "gdax-trading-toolkit/build/src/exchanges";
import { LiveBookConfig, LiveOrderbook, SkippedMessageEvent } from "gdax-trading-toolkit/build/src/core";

const logger = GTT.utils.ConsoleLoggerFactory({ level: 'debug' });
var fs = require('fs');

/*
 Simple demo that sets up a live order book and then periodically prints some stats to the console.
 */

 const productIds: Array<string> = ['BTC-USD', 'BTC-EUR', 'ETH-USD', 'ETH-BTC', 'LTC-USD', 'LTC-BTC'];

 orderBook(productIds);

 function orderBook(productIds: Array<string>) {
     for(var i = 0; i < productIds.length; i++) {
         setUpBook(productIds[i]);
     }
 }

 function setUpBook(productId:string) {
     GTT.Factories.GDAX.FeedFactory(logger, [productId]).then((feed: GDAXFeed) => {
         // Configure the live book object
         const config: LiveBookConfig = {
             product: productId,
             logger: logger
         };
         const book = new LiveOrderbook(config);
         book.on('LiveOrderbook.snapshot', () => {
             setInterval(() => {

                 var midprice = Number(book.state().asks[0].price.plus(book.state().bids[0].price).dividedBy(2))
                 var bestAsk = Number(book.state().asks[0].price);
                 var filename = './db/' + productId + '.json';

                 fs.writeFileSync(filename, JSON.stringify({
                    midprice: midprice,
                    bestAsk: bestAsk
                 }));

                 console.log("liveOrderBook wrote mid: " + midprice + " and bestAsk: " + bestAsk + " to " + filename);
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

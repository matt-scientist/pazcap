import * as GTT from 'gdax-trading-toolkit';
import { GDAXFeed } from "gdax-trading-toolkit/build/src/exchanges";
import { LiveBookConfig, LiveOrderbook, SkippedMessageEvent } from "gdax-trading-toolkit/build/src/core";
import { Ticker } from "gdax-trading-toolkit/build/src/exchanges/PublicExchangeAPI";
const logger = GTT.utils.ConsoleLoggerFactory({ level: 'debug' });
var fs = require('fs');
//const printOrderbook = GTT.utils.printOrderbook;
//const printTicker = GTT.utils.printTicker;
/*
 Simple demo that sets up a live order book and then periodically prints some stats to the console.
 */

 var eurusd;

 fs.readFile("./../db/eurusd.txt", "utf-8", function(err: String, data: String) {
    console.log(Number(data));
    eurusd = data;
 });

 console.log(eurusd)

//var BigNumber = require('bignumber.js');
//console.log(eurusd)

 btcUsd();
 btcEur();
 //fs.readFile("eurusd.txt", 'utf8'}//function(err: String, data: String) {
    //console.log(err, data);
    //console.log('sup');
    //console.log(toString(data))
 //});



 function btcUsd () {
    const product = 'BTC-USD';

    GTT.Factories.GDAX.FeedFactory(logger, [product]).then((feed: GDAXFeed) => {
// Configure the live book object
    const config: LiveBookConfig = {
        product: product,
        logger: logger
    };
    const book = new LiveOrderbook(config);
    book.on('LiveOrderbook.snapshot', () => {
        logger.log('info', 'Snapshot received by LiveOrderbook Demo');
        setInterval(() => {
            // console.log(printOrderbook(book, 3));
            console.log('USD---------------------------------------');
            console.log("Size: " + book.state().asks[0].totalSize + " | Price: " + book.state().asks[0].price)
            console.log("Size: " + book.state().bids[0].totalSize + " | Price: " + book.state().bids[0].price)

            var midprice = Number(book.state().asks[0].price.plus(book.state().bids[0].price).dividedBy(2))

            console.log(midprice);
            fs.writeFileSync('./../db/mid_btcusd.txt', midprice);

            console.log("\n");
        }, 2000);
    });
    book.on('LiveOrderbook.ticker', (ticker: Ticker) => {
        //console.log(printTicker(ticker));
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

  function btcEur () {
    const product = 'BTC-EUR';
    
    GTT.Factories.GDAX.FeedFactory(logger, [product]).then((feed: GDAXFeed) => {
// Configure the live book object
    const config: LiveBookConfig = {
        product: product,
        logger: logger
    };
    const book = new LiveOrderbook(config);
    book.on('LiveOrderbook.snapshot', () => {
        logger.log('info', 'Snapshot received by LiveOrderbook Demo');
        setInterval(() => {
            // console.log(printOrderbook(book, 3));
            console.log('EUR---------------------------------------');
            console.log("Size: " + book.state().asks[0].totalSize + " | Price: " + book.state().asks[0].price)
            console.log("Size: " + book.state().bids[0].totalSize + " | Price: " + book.state().bids[0].price)
            console.log("___________________________________________________________________________________")

            var midprice = Number(book.state().asks[0].price.plus(book.state().bids[0].price).dividedBy(2))

            console.log(midprice);
            fs.writeFileSync('./../db/mid_btceur.txt', midprice);

            console.log("\n\n");
        }, 2000);
    });
    book.on('LiveOrderbook.ticker', (ticker: Ticker) => {
        //console.log(printTicker(ticker));
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

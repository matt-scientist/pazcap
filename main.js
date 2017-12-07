const GTT = require('gdax-trading-toolkit');

const logger = GTT.utils.ConsoleLoggerFactory({ level: 'debug' });


const products = ['BTC-USD'];

GTT.Factories.GDAX.FeedFactory(logger, products).then((feed) => {
// Configure the live book object
    const config = {
        product: product,
        logger: logger
    };
    const book = new LiveOrderbook(config);
    book.on('LiveOrderbook.snapshot', () => {
        logger.log('info', 'Snapshot received by LiveOrderbook Demo');
        setInterval(() => {
            console.log(printOrderbook(book, 10));
            logger.log('info', `Cumulative trade volume: ${tradeVolume.toFixed(4)}`);
        }, 5000);
    });
    book.on('LiveOrderbook.ticker', (ticker) => {
        console.log(printTicker(ticker));
    });
    book.on('LiveOrderbook.trade', (trade) => {
        tradeVolume += +(trade.size);
    });
    book.on('LiveOrderbook.skippedMessage', (details) => {
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
'use strict';

const binance = require('./scripts/data-management/binanceBook');
const kucoin = require('./scripts/utility/kucoin_methods');

module.exports = {
    startBot: startBot
};

var EXCHANGE_PAIR = {
    BINANCE_KUCOIN : "binance-kucoin"
};

// const BINANCE_KUCOIN = "binance-kucoin";

/* START BOT */
let params = process.argv.slice(2);
startBot(params[0], params[1]);


function startBot(exchangePair, product) {
    switch(exchangePair) {
        case EXCHANGE_PAIR.BINANCE_KUCOIN:

            let binanceFileName = './db/binance/' + product + '.json';
            let kucoinFileName = './db/kucoin/' + product + '.json';

            // open order books
            binance.execute(product, binanceFileName);
            kucoin.execute(product, kucoinFileName);

        default:
            return
    }
}


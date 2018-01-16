const binance = require('./utility/binance_methods');
var fs = require("fs");
var rsvp = require('rsvp');
const { getAccountGdax } = require('./utility/gdax_methods');
const { loadFile } = require('./utility/load_file');

const gdaxBTCId = '0e75cc76-4648-4a05-af75-75249c51c9e6';
const gdaxLTCId = '7760f9e8-96d8-4fc1-86af-ad8afed42735';

//var promises = ['./db/gdax/BTC-USD.json', './db/binance/LTC-USD.json'].map(loadFile);

// //strick values
// const GdaxBTCId = '0e75cc76-4648-4a05-af75-75249c51c9e6';
// const GdaxLTCId = '7760f9e8-96d8-4fc1-86af-ad8afed42735';

execute();               

function execute () {
    binance.balance(function(balances) {

        const initialBinanceBTC = balances.BTC.available;
        const initialBinanceLTC = balances.LTC.available;

        getAccountGdax(gdaxBTCId, function(data) {
            const initialGdaxBTC = (data.balance);

            getAccountGdax(gdaxLTCId, function(data) {
                const initialGdaxLTC = (data.balance);

                console.log('INITIAL VALUES: \n')
                console.log('gdax:')
                console.log('ltc ' + initialGdaxLTC);
                console.log('btc ' + initialGdaxBTC);
                console.log('binance:')
                console.log('ltc ' + initialBinanceLTC);
                console.log('btc ' + initialBinanceBTC);
                console.log('\n');

                const initials = {
                    'initialGdaxLTC': initialGdaxLTC,
                    'initialGdaxBTC': initialGdaxBTC,
                    'initialBinanceLTC': initialBinanceLTC,
                    'initialBinanceBTC': initialBinanceBTC
                }

                setInterval(function() {
                    pnlCalc(initials);
                }, 10000);
             });
        });
    });
}

function pnlCalc(initials) {
    console.log('\ncalculating PNL...\n');
    binance.balance(function(balances) {

        const binanceBTC = balances.BTC.available;
        const binanceLTC = balances.LTC.available;

        getAccountGdax(gdaxBTCId, function(data) {
            const gdaxBTC = (data.balance);

            getAccountGdax(gdaxLTCId, function(data) {
                const gdaxLTC = (data.balance);

                console.log('CURRENT VALUES: \n')
                console.log('gdax:')
                console.log('ltc ' + gdaxLTC);
                console.log('btc ' + gdaxBTC);
                console.log('binance:')
                console.log('ltc ' + binanceLTC);
                console.log('btc ' + binanceBTC);
                console.log('\n')

                calculateBalances(initials.initialGdaxBTC, gdaxBTC, initials.initialGdaxLTC, gdaxLTC, initials.initialBinanceBTC, binanceBTC, initials.initialBinanceLTC, binanceLTC);

            });

        });
    });
}

function calculateBalances(gdax_btc_start, gdax_btc_end, gdax_ltc_start, gdax_ltc_end, bin_btc_start, bin_btc_end, bin_ltc_start, bin_ltc_end) {

    let netBTC = ((gdax_btc_end - gdax_btc_start) - (bin_btc_start - bin_btc_end));
    let netLTC = ((bin_ltc_end - bin_ltc_start) - (gdax_ltc_start - gdax_ltc_end));

    console.log('netBTC var', netBTC);
    console.log('netLTC var', netLTC);

    console.log('Net BTC: ', ((gdax_btc_end - gdax_btc_start) - (bin_btc_start - bin_btc_end)));
    console.log('Net LTC: ', ((bin_ltc_end - bin_ltc_start) - (gdax_ltc_start - gdax_ltc_end)));
    console.log('Net Dollars')

}


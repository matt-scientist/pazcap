const binance = require('node-binance-api');
const secret = require('../../secrets/secret_binance');

binance.options({
    'APIKEY':secret.key,
    'APISECRET': secret.secret
});

module.exports = binance;


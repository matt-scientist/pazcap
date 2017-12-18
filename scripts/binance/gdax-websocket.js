const binance = require('node-binance-api');
const secret = require('../../secrets/secret_binance');
var fs = require("fs");
const Gdax = require('gdax');
var api_key = require("../../secrets/secret.json");
const Websocket = require('ws');
const { signRequest } = require('./request_signer');

binance.options({
    'APIKEY':secret.key,
    'APISECRET': secret.secret
});


const key = api_key["key"];
const b64secret = api_key["secret"];
const passphrase = api_key["pass"];
const apiURI = 'https://api.gdax.com';

const gdaxAuthedClient = new Gdax.AuthenticatedClient(key, b64secret, passphrase, apiURI);

var auth = {
	'secret': api_key.secret,
	'key': api_key.key,
	'passphrase': api_key.pass
}

var socket = new Websocket('wss://ws-feed.gdax.com');

socket.on('open', onOpen);
socket.on('message', onMessage);
socket.on('close', onClose);
socket.on('error', onError);


function onOpen () {
	console.log('Opened web socket');
	 const subscribeMessage = {
      type: 'subscribe',
      product_ids: ['LTC-BTC'],
      channels: ['user'],
      profileId: 'cbcceb96-8fd8-4693-be07-387e169e8393'
    };

    let sig = signRequest(
        auth,
        'GET',
        '/users/self/verify'
    );
   	Object.assign(subscribeMessage, sig);

    socket.send(JSON.stringify(subscribeMessage));

    var pinger = setInterval(() => {
        if (socket) {
          socket.ping('keepalive');
        }
      }, 30000);
}

function onMessage (data) {
	var message = JSON.parse(data);
		console.log(message);
}

function onClose() {
	clearInterval(pinger);
    socket = null;
}

function onError(error) {
	if (!error) {
      return;
    }

    if (error.message === 'unexpected server response (429)') {
      throw new Error(
        'You are connecting too fast and are being throttled! Make sure you subscribe to multiple books on one connection.'
      );
    }
}


const binance = require('node-binance-api');
const secret = require('../../secrets/secret_binance');
var fs = require("fs");
var api_key = require("../../secrets/secret.json");
const Websocket = require('ws');
const { signRequest } = require('../utility/request_signer');

binance.options({
    'APIKEY':secret.key,
    'APISECRET': secret.secret
});

var auth = {
	'secret': api_key.secret,
	'key': api_key.key,
	'passphrase': api_key.pass
}

let currentOrderSize = null;
let currentOrderProduct = null;

let socketOn = false;

var socket = new Websocket('wss://ws-feed.gdax.com');

setInterval(function() {
	console.log('socket on: ', socketOn);
}, 8000);

socket.on('open', onOpen);
socket.on('message', onMessage);
socket.on('close', onClose);
socket.on('error', onError);

function onOpen () {
	socketOn = true;
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
	if (message.type === 'received') {
		console.log(message);
		currentOrderSize = message.size;
		currentOrderProduct = message.product_id;
	}

	if ((message.type === 'done') && (message.reason === 'filled')) {
		console.log(message);

		binance.marketBuy('LTCBTC', currentOrderSize, function(response) {

  		console.log("Market Buy response: ", response);
  		console.log("order id: " + response.orderId);

		});	
	};
}

function onClose() {
	clearInterval(pinger);
    socket = null;
    console.log('websocket closed');
    socketOn = false;
}

function onError(error) {
	if (!error) {
      return;
    }

    console.log('websocket error');

    if (error.message === 'unexpected server response (429)') {
      throw new Error(
        'You are connecting too fast and are being throttled! Make sure you subscribe to multiple books on one connection.'
      );
    }
    socketOn = false;
}


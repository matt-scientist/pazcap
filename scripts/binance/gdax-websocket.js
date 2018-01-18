const binance = require('../utility/binance_methods');
var api_key = require("../../secrets/secret.json");
var fs = require("fs");
const Websocket = require('ws');
const { signRequest } = require('../utility/request_signer');
const { removeDash } = require('../utility/dash');

var auth = {
	'secret': api_key.secret,
	'key': api_key.key,
	'passphrase': api_key.pass
};

const profileId = 'cbcceb96-8fd8-4693-be07-387e169e8393';

let currentOrderSize = null;
let currentOrderProduct = null;
let socketOn = false;

setInterval(function() {
	console.log('socket on: ', socketOn);
}, 5000);


var tokenPair = "";

function execute(product) {
    var socket = new Websocket('wss://ws-feed.gdax.com');

    tokenPair = product;

    socket.on('open', onOpen);
    socket.on('message', onMessage);
    socket.on('close', onClose);
    socket.on('error', onError);
}


function onOpen () {
	socketOn = true;
	console.log('Opened web socket');
	 const subscribeMessage = {
      type: 'subscribe',
      product_ids: [tokenPair],
      channels: ['user'],
      profileId: profileId
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
		currentOrderProduct = message.product_id.removeDash();
	}

	if ((message.type === 'done') && (message.reason === 'filled')) {
		console.log(message);

		binance.marketBuy(currentOrderProduct, currentOrderSize, function(response) {

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
    console.log('!error');
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


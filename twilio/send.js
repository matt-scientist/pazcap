'use strict';

const ehingerCell = '+12033135821';
const strickCell = '19143297111';
const roCell = '+15168641707';

const config = require('../config').twilio;

var twilio = require('twilio');
var client = new twilio(config.accountSid, config.authToken);

module.exports = {
    sendMessage: sendMessage
};

function sendMessage(messageText) {
    client.messages.create({
        body: messageText,
        to: ehingerCell,
        from: config.phoneNumber
    }).then((message) => console.log("Alert Sent."));
}


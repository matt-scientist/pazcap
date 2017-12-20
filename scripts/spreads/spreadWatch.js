'use strict';

const send = require('../../twilio/send');
const { loadFile } = require('../utility/load_file');

var spreadFilePath = './db/spreads/LTC-BTC_gdax_binance.json';
var spreadAlertThreshold = 0.0003;

var SPREAD_OPP = {
    PassSell_ActBuy : 0,
    ActSell_ActBuy  : 1,
    PassBuy_ActSell : 2,
    ActBuy_ActSell  : 3,
    No_Opp          : 4
};

console.log('in file');
var currentOpp = SPREAD_OPP.No_Opp;

setInterval(function() {
    execute();
}, 4000);

function execute() {
    loadFile(spreadFilePath).then(spreadData => {

        console.log("localStorage: ");

        spreadData = JSON.parse(spreadData);

        let passSell_actBuy_spread = spreadData["pasSell_actBuy"];
        let actSell_actBuy_spread = spreadData["actSell_actBuy"];
        let passBuy_actSell_spread = spreadData["pasBuy_actSell"];
        let actBuy_actSell_spread = spreadData["actBuy_actSell"];

        if(passSell_actBuy_spread >= spreadAlertThreshold || actSell_actBuy_spread >= spreadAlertThreshold) {
            let spread = 0.0;
            let recommendedAction = "";
            var newOpp = SPREAD_OPP.No_Opp;
            if(passSell_actBuy_spread >= actSell_actBuy_spread) {
                spread = passSell_actBuy_spread;
                recommendedAction = "Pass Sell - Act Buy";
                newOpp = SPREAD_OPP.PassSell_ActBuy;
            } else {
                recommendedAction = "Act Sell - Act Buy";
                spread = actSell_actBuy_spread;
                newOpp = SPREAD_OPP.ActSell_ActBuy;
            }

            if(currentOpp == SPREAD_OPP.No_Opp) {
                console.log(" ~ NEW OPPORTUNITY DETECTED ~");
                let twilioMessage = "SPREAD ALERT - Binance Discount\nCurrent Spread: " + spread +"\n" + recommendedAction;
                console.log("sending alert: ", twilioMessage);
                send.sendMessage(twilioMessage);
            }

            currentOpp = newOpp;
            localStorage.setItem('spreadOpportunity', currentOpp.toString());
            localStorage.setItem('spread', spread);

        } else if (passBuy_actSell_spread >= spreadAlertThreshold || actBuy_actSell_spread >= spreadAlertThreshold) {

            let spread = 0.0;
            let recommendedAction = "";
            var newOpp = SPREAD_OPP.No_Opp;

            if(passBuy_actSell_spread >= actBuy_actSell_spread) {
                spread = passBuy_actSell_spread;
                recommendedAction = "Pass Buy - Act Sell";
                newOpp = SPREAD_OPP.PassBuy_ActSell;
            } else {
                spread = actBuy_actSell_spread;
                recommendedAction = "Act Buy - Act Sell";
                newOpp = SPREAD_OPP.ActBuy_ActSell;
            }

            /* New Spead Opp Detected */
            if(currentOpp == SPREAD_OPP.No_Opp) {
                console.log(" ~ NEW OPPORTUNITY DETECTED ~");
                let twilioMessage = "SPREAD ALERT - GDAX Discount\nCurrent Spread: " + spread +"\n" + recommendedAction;
                console.log("sending message: ", twilioMessage);
                send.sendMessage(twilioMessage);
            } else {
                console.log("CURRENT SPREAD OPP: ", newOpp);
            }
            currentOpp = newOpp;
            localStorage.setItem('spreadOpportunity', currentOpp.toString());
            localStorage.setItem('spread', spread);
        } else {
            currentOpp = SPREAD_OPP.No_Opp;
            console.log("No spread opportunity.");
        }
    }, (err) => {
        console.log("err from spread watch: ", err);
    })
}



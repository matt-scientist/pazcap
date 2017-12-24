'use strict';

const cheerio = require('cheerio');
const request = require('request');
const fs = require('fs');
const send = require('./twilio/send');

var gdaxUrl = 'https://support.gdax.com/customer/portal/articles/2425188';

setInterval(function() {
    main();
}, 4000);

/*
* Queries GDAX website and looks for available pairs in the US market
*/
function findAvailableGdaxPairs() {
    return new Promise((resolve, reject) => {
        request(gdaxUrl, function (error, response, html) {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html);
                $('.span8').find('table').find('tr').find('td').each(function(i, el) {
                    if($(this).children('p').eq(0).text() === "US*") {
                        let pairs = [];
                        $(this).next().children('p').each(function(i, el) {pairs.push($(this).text())});
                        resolve(pairs);
                    }
                });
            }
        });
    });
}

/*
*  Reads local JSON file with known pairs.
*/
function getKnownPairs() {
    return new Promise((resolve, reject) => {
        fs.readFile ("pairs.json", 'utf8', function (error, data) {
            if (error) {
                reject(error);
            }
            resolve(JSON.parse(data).pairs);
        });
    });
}

/* Compares the pairs returned from GDAX and know pairs stored on server.
*  Returns any pairs that are new
*
**/
function findNewPairs(gdaxPairs, knownPairs) {
    let newPairs = [];
    gdaxPairs.forEach(function(pair) {
        if(!knownPairs.includes(pair)) {
            newPairs.push(pair);
        }

    });
    return newPairs;
}

/*
* Update known pairs in JSON file.
*/
function updateKnownPairs(allPairs) {
    fs.writeFileSync('./pairs.json', JSON.stringify({"pairs": allPairs}));
    console.log("Updated pairs.json");
}

/*
* Call Twilio API to send text alert
*/
function sendNewPairsAlert(newPairs) {
    let alertText = "GDAX NEW PAIRS ALERT\nNew Pairs:\n" + newPairs;
    send.sendMessage(alertText);
    console.log(alertText);
}

function main() {
    findAvailableGdaxPairs().then(pairs => {
        console.log("GDAX Pairs: ", pairs);
        getKnownPairs().then(knownPairs => {
            console.log("Known Pairs: ", knownPairs);
            let newPairs = findNewPairs(pairs, knownPairs);
            if(newPairs.length > 0) {
                sendNewPairsAlert(newPairs);
                updateKnownPairs(pairs);
            } else {
                console.log("No new pairs detected.\n");
            }
        }, err => {
            console.log("err2: ", err);
        })
    }, err => {
        console.log("err: ", err);
    });
}


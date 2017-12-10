var fs = require('fs');
var rsvp = require('rsvp');

setInterval(function() {
    execute()
}, 5000);

function execute() {
    var loadFile = function (path) {
        return new rsvp.Promise(function (resolve, reject) {
            fs.readFile (path, 'utf8', function (error, data) {
                if (error) {
                    reject(error);
                }
                resolve(data);
            });
        });
    };

    var promises = ['./db/mid_btcusd.txt', './db/mid_btceur.txt', './db/eurusd.txt'].map(loadFile);

    rsvp.all(promises).then(function(files) {
        // proceed - files is array of your files in the order specified above.

        console.log(files);
        var spread = files[0] - files[1]*files[2];
        console.log('Spread: ', spread);
        fs.writeFileSync('./db/spread.txt', spread);
        var active_fee = files[0]*.0025 + files[1]*files[2]*.0025;
        //console.log('4x Active Fee: ', active_fee*2);
        var active_fee_x2 = active_fee * 2;
        var spread_value_buy = Number(files[0]);
        var base_profit = Math.abs(spread) - active_fee_x2;
        var profit_passive_active = Math.abs(spread) - active_fee;
        //console.log('Profit 4x Active: ', base_profit);
        //console.log('Profit Passive Active: ', profit_passive_active);

        var roi = Number(base_profit/spread_value_buy*100);

        //console.log('Active-Active Entry Cost: ' + active_fee);
        //console.log('Active Entry Cost / Edge: ' + Math.abs(active_fee/spread*100) + '%');
        //console.log('Profit - Entry Fee * 2 / Spread Value (ROI): ' + roi + '%\n');

    }).catch(function(reason) {
        console.log(reason); // something went wrong...
    });
}


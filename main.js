'use strict';

require('ts-node').register({ /* options */ });
const cp = require('child_process');
const spawn = cp.spawn;


var liveOrderBookChild = spawn('ts-node', ['./scripts/live-order-book.ts']);

liveOrderBookChild.on('error', function(err) {
    console.log('received error from liveOrderBookChild');
    console.log('err: ', err);
});

liveOrderBookChild.stdout.on('data', function(data) {
    console.log('stdout: ' + data);
});


// exec('ts-node ./scripts/live-order-book.ts', (error, stdout, stderr) => {
//     if (error) {
//         console.error(`exec error: ${error}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
//     console.log(`stderr: ${stderr}`);
// });

// //const eurusdChild = spawn('./scripts/eurusd.js');
// const liveBookChild = spawn('./scripts/live-order-book.ts');
//
// process.stdout.pipe(liveBookChild.stdout);
//
// liveBookChild.stdout.on('data', (data) => {
//     console.log(`child stdout:\n${data}`);
// });


const {Builder, By, Key, until} = require('selenium-webdriver');
var fs = require('fs');

let b_int, b_pip, eurusd;

let driver = new Builder()
    .forBrowser('chrome')
    .build();

execute();

function execute() {
	console.log("--Beginning Execution--");
	driver.get('https://www.oanda.com/currency/live-exchange-rates/EURUSD/');
	driver.sleep(5000);
	driver.findElement(By.id('EUR_USD-b-int')).getAttribute("innerHTML").then(function(data) {
		b_int = data;
		if (b_int <= 0) {
			console.log('Element Not Found: Refreshing \n');
			driver.sleep(1000);
			driver.navigate().refresh();
			execute();
		}
		else {
			driver.findElement(By.id('EUR_USD-b-pip')).getAttribute("innerHTML").then(function(data) {
				b_pip = data;
				eurusd = b_int.toString().concat(b_pip.toString());
				fs.writeFileSync('./db/eurusd.txt', eurusd);
				console.log('Wrote ' + Number(eurusd) + ' to eurusd.txt \n');
				driver.navigate().refresh();
				execute();

			});
		}
	});
};

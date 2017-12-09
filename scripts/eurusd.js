const {Builder, By, Key, until} = require('selenium-webdriver');
var fs = require('fs');

let b_int, b_pip, eurusd;

	let driver = new Builder()
    .forBrowser('chrome')
    .build();

execute();


function execute() {
	driver.get('https://www.oanda.com/currency/live-exchange-rates/EURUSD/');
	driver.sleep(5000);
	driver.fintsdElement(By.id('EUR_USD-b-int')).getAttribute("innerHTML").then(function(data) {
		console.log('int found');
		b_int = data;
		if (b_int <= 0) {
			console.log('about to refresh');
			driver.sleep(1000);
			driver.navigate().refresh();
			execute();
		}
		else {
			driver.findElement(By.id('EUR_USD-b-pip')).getAttribute("innerHTML").then(function(data) {
				console.log('pip found');
				b_pip = data;
				eurusd = b_int.toString().concat(b_pip.toString());
				console.log(Number(eurusd));
				fs.writeFileSync('./db/eurusd.txt', eurusd);
				console.log('wrote above value to file');
				driver.quit();
			});
		}
	});
};
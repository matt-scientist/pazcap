function Order (side, prod, type, size, price) {
	this.side = side;
	this.prod = prod;
    this.type = type;
    this.size = size;
    this.price = price;
    this.getInfo = function() {
        return this.side + ' ' + this.prod + ' ' + this.type + ' ' + this.size + ' ' + this.price;
    };
}

var test_order = new Order('sell', 'LTCUSD', 'limit', 1, 256.01);

console.log(test_order.getInfo())
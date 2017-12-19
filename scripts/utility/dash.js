module.exports.addDash = (product) => {
	return product.slice(0, 3) + "-" + product.slice(3);
}

module.exports.removeDash = (product) => {
	return product.slice(0, 3) + product.slice(4);
}
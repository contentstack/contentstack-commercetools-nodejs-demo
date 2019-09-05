var express = require('express');
var router = express.Router();
const { getAllProducts } = require('../lib/commercetool')

router.get('/:id', (req, res, next) => {
	var url = req.path.split("/");
	var locale;
	res.cookie('locale', 'en-us', "/");
	locale = 'en-us';
	url = url[1];
	locale = locale ? locale : 'en-us';
	var Query = Stack.ContentType('product').Query()
		.language(`${locale}`)
		.query({ "locale": `${locale}` })
		.toJSON()
		.or(Stack.ContentType('product').Query().where('uid', req.params.id), Stack.ContentType('product').Query().where('url', `/product/${req.params.id}`))
		.includeReference(['related_products', 'categories'])
		.find()
		.spread(function success(result) {
			result[0] = result[0] ? result[0] : {};

			console.log("&&&",result[0])

			getAllProducts().then((products) => {
				products.body.results.forEach(function (ids) {
					if (result[0].product_link.id === ids.id) {
						result[0].product_link = ids;
					}
				})

				result[0].related_products.forEach(function (data) {
					if (req.originalUrl.includes("/fr")) {
						data.url = "/" + locale.split("-", 1) + data.url;
					}
					products.body.results.forEach(function (ids) {
						if (data.product_link.id === ids.id) {
							data.product_link = ids;
						}
					})
				})
				// Page Render
				console.log("====",result[0])
				res.render('pages/products', {
					product: result[0],
					contentType: "product",
					active: req.originalUrl,
					url: config.url
				})
			}, function error(error) {
				next(error);
			})
		})
})

module.exports = router;

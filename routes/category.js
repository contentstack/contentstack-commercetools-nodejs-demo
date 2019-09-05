var express = require('express');
var router = express.Router();
const { getAllProducts } = require('../lib/commercetool')

router.get('/:category', (req, res, next) => {
	var url = req.path.split("/");
	var locale;
	if (req.originalUrl.includes("/en/")) {
		url = url[1];
		locale = 'en-us';
		res.cookie('locale', locale, "/");
	} else if (req.originalUrl.includes("/fr/")) {
		url = url[1];
		res.cookie('locale', 'fr-fr', "/");
		locale = 'fr-fr';
	}
	else {
		res.cookie('locale', 'en-us', "/");
		locale = 'en-us';
		url = url[1];
	}

	locale = locale ? locale : 'en-us';
	var Query = Stack.ContentType('product').Query()
		.language(`en-us`)
		.query({ "locale": `en-us` })
		.toJSON()
		.limit(9)
		.query({ "categories": { "$in_query": { "url": "/category/" + req.params.category } } })
		.only(["title", "url", "in_stock", "featured_image", "offer_price", "price", "product_link"])
		.includeCount()
		.find()
		.spread(function success(result, count) {
			// //commercetools pricing
			getAllProducts().then((products) => {
				result.forEach(function (data) {
					if (req.originalUrl.includes("/en/") || req.originalUrl.includes("/fr/")) {
						data.url = "/" + locale.split("-", 1) + data.url;
					}
					products.body.results.forEach(function (ids) {
						if (data.product_link.id === ids.id) {
							data.product_link = ids;
						}
					})
				});
				res.render('pages/category', {
					products: result,
					active: req.originalUrl.slice(0, req.originalUrl.indexOf('?') + 1) || req.originalUrl,
					count: count,
					url: config.url,
					category: req.params.category,
					url: config.url
				})

			}, function error(error) {
				next(error);
			});
		});
})


module.exports = router;

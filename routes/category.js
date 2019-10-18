var express = require('express');
var router = express.Router();
const { getAllProducts } = require('../lib/commercetool')

router.get('/:category', (req, res, next) => {

	var url = req.path.split("/");
	res.cookie('locale', 'en-us', "/");
	locale = 'en-us';
	url = url[1];
	locale = locale ? locale : 'en-us';
	var Query = Stack.ContentType('product').Query()
		.language(`en-us`)
		.query({ "locale": `en-us` })
		.toJSON()
		.limit(9)
		.query({ "categories": { "$in_query": { "url": "/category/" + req.params.category } } })
		.only(["title", "url", "in_stock", "featured_image", "offer_price", "price", "number"])
		.includeCount()
		.find()
		.spread(function success(result, count) {
			// //commercetools pricing
			res.render('pages/category', {
					products: result,
					active: req.originalUrl.slice(0, req.originalUrl.indexOf('?') + 1) || req.originalUrl,
					count: count,
					category: req.params.category,
				})
		});
})


module.exports = router;

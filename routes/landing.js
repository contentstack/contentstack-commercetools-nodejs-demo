var express = require('express');
var router = express.Router();
var commercetools = require('../lib/commerce.js');
const { key, cluster, channleNamePrefix } = config.realtime;

router.get('/*', (req, res, next) => {

	var url = req.path.split("/");
	var locale;
	if (req.path.includes("/en")) {
		url = url[2];
		locale = 'en-us';
		res.cookie('locale', locale, "/");
	} else if (req.path.includes("/fr")) {
		url = url[2];
		res.cookie('locale', 'fr-fr', "/");
		locale = 'fr-fr';
	}
	else {
		res.cookie('locale', 'en-us', "/");
		locale = 'en-us';
		url = url[1];
	}

	locale = locale ? locale : 'en-us';
	var Query = Stack.ContentType('landing').Query()
		.language(`${locale}`)
		.query({ "locale": `${locale}` })
		.toJSON()
		.query({ "url": "/" + url })
		.includeCount()
		.includeReference('modular_blocks.products.reference')
		.find()
		.spread(function success(result, count) {
			if (!result[0]) {
				return next();
			}
			var bannerImage;
			result[0].modular_blocks.forEach(function (element) {
				try {
					if (element.banner != undefined) {
						bannerImage = element.banner.banner_image;
					}
				} catch (e) {
					console.log('err', e);
				}
			});

			commercetools.getActionsForRequest(req, res).then((products) => {
				result[0].modular_blocks.find((element) => {
					if (element.hasOwnProperty("products")) {
						element.products.reference.forEach(function (data) { 
							products.results.forEach(function (ids) {
								if (data.product_link.id === ids.id) {
								  data.product_link = ids;
								}
							})
						})
					}
				})

				res.render('pages/landing', {
					data: JSON.stringify(result[0]),
					landing: result[0],
					contentType: "landing",
					active: req.originalUrl.slice(0, req.originalUrl.indexOf('?') + 1) || req.originalUrl,
					realtime: { key, cluster, channel: `${config.realtime.channleNamePrefix}-${result[0].uid}`, event: "publish" },
					trackingId: config.analytics.trackingId,
					monetate: config.monetate,
					url: config.url,
					banner: bannerImage
				})
			}, function error(error) {
				next(error);
			});
		});
});

module.exports = router;

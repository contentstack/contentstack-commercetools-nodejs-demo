var express = require('express');
var router = express.Router();
var commercetools = require('../lib/commerce.js');
const { key, cluster, channleNamePrefix } = config.realtime;

router.get('/', (req, res, next) => {
				// Page Render

	console.log("============dinesh");
				res.render('pages/home2', {

				})
			}, function error(error) {
				next(error);
})

module.exports = router;
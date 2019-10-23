const express = require('express');
const router = express.Router();
const {getAllProducts} = require('../lib/commercetool');
const product_link_id = config.contentstack.ct_extension_id;

router.get('/:category', (req, res, next) => {
  let url = req.path.split('/');
  res.cookie('locale', 'en-us', '/');
  locale = 'en-us';
  url = url[1];
  locale = locale ? locale : 'en-us';
  const Query = Stack.ContentType('product').Query()
      .language(`en-us`)
      .query({'locale': `en-us`})
      .toJSON()
      .limit(9)
      .query({'categories': {'$in_query': {'url': '/category/' + req.params.category}}})
      .only(['title', 'url', 'in_stock', 'featured_image', 'offer_price', 'price', product_link_id])
      .includeCount()
      .find()
      .spread(function success(result, count) {
        // //commercetools pricing
        getAllProducts(req, res).then((products) => {
          result.forEach(function(data) {
            products.body.results.forEach(function(ids) {
              if (data[product_link_id].id === ids.id) {
                data['product_link'] = ids;
              }
            });
          });

          res.render('pages/category', {
            products: result,
            active: req.originalUrl.slice(0, req.originalUrl.indexOf('?') + 1) || req.originalUrl,
            count: count,
            url: config.url,
            category: req.params.category,
            url: config.url,
          });
        }, function error(error) {
          next(error);
        })
            .catch((err)=>console.log(err));
      });
});


module.exports = router;

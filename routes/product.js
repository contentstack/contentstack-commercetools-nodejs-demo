const express = require('express');
const router = express.Router();
const {getAllProducts} = require('../lib/commercetool');
const product_link_id = config.contentstack.ct_extension_id;

router.get('/:id', (req, res, next) => {
  let url = req.path.split('/');
  let locale;
  res.cookie('locale', 'en-us', '/');
  locale = 'en-us';
  url = url[1];
  locale = locale ? locale : 'en-us';
  const Query = Stack.ContentType('product').Query()
      .language(`${locale}`)
      .query({'locale': `${locale}`})
      .toJSON()
      .or(Stack.ContentType('product').Query().where('uid', req.params.id), Stack.ContentType('product').Query().where('url', `/product/${req.params.id}`))
      .includeReference(['related_products', 'categories'])
      .find()
      .spread(function success(result) {
        result[0] = result[0] ? result[0] : {};
        getAllProducts().then((products) => {
          products.body.results.forEach(function(ids) {
            if (result[0][product_link_id].id === ids.id) {
              result[0]['product_link'] = ids;
            }
          });
          result[0].related_products.forEach(function(data) {
            products.body.results.forEach(function(ids) {
              if (data[product_link_id].id === ids.id) {
                data['product_link'] = ids;
              }
            });
          });
          // Page Render
          res.render('pages/products', {
            product: result[0],
            contentType: 'product',
            active: req.originalUrl,
            url: config.url,
          });
        }, function error(error) {
          next(error);
        });
      });
});

module.exports = router;

var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');
const { getAllProducts } = require('../cmtest')


router.get('/:locale', (req, res, next) => {
  var locale;
  if (req.params.locale) {
    for (const key of Object.keys(config.languages)) {

      if (key == req.params.locale) {
        locale = config.languages[key];
        res.cookie('locale', locale, "/");
      } else {
        res.cookie('locale', 'en-us', "/");
        locale = 'en-us';
      }
    }
  } else {
    res.cookie('locale', 'en-us', "/");
    locale = 'en-us';
  }
  var Query = Stack.ContentType('homepage_personalised').Query()
    .language(`${locale}`)
    .toJSON()
    .includeCount()
    .includeReference("new_arrivals.products")
    .find()
    .spread(function success(result, count) {
      //commercetools pricing
      getAllProducts().then((products) => {
        result[0].new_arrivals.forEach(function (data) {
          data.products.forEach(function (result) {
            if (req.originalUrl.includes("/fr")) {
              result.url = "/" + locale.split("-", 1) + result.url;
            }
            products.body.results.forEach(function (ids) {
              if (result.product_link.id === ids.id) {
                result.product_link = ids;
              }
            })
          })
        })


        return res.render('pages/home', {
            data: result[0],
            contentType: "homepage_personalised",
            gift:result[0].card.gift[0],
            first_banner:result[0].main_banner.first_section[0],
            shop_instagram: result[0].shop_instagram,
            url: config.url
        })

      }, function error(error) {
        next(error);
      });
    });
})

router.get('/', (req, res, next) => {
  res.cookie('locale', 'en-us', "/");
  var Query = Stack.ContentType('homepage_personalised').Query()
    .language(`en-us`)
    .query({ "locale": `en-us` })
    .toJSON()
    .includeCount()
    .includeReference("new_arrivals.products")
    .find()
    .spread(function success(result, count) {
      console.log(result[0].new_arrivals[0].products[0],"LLLLL");
      
      getAllProducts().then((products) => {
        result[0].new_arrivals.forEach(function (data) {
          data.products.forEach(function (result) {
            products.body.results.forEach(function (ids) {
              if (result.product_link.id === ids.id) {
                result.product_link = ids;
              }
            })
          });
        });

        return res.render('pages/home', {
            data: result[0],
            contentType: "homepage_personalised",
            gift:result[0].card.gift[0],
            first_banner: result[0].main_banner.first_section[0],
            shop_instagram: result[0].shop_instagram,
            url: config.url
          })
      }, function error(error) {
        next(error);
      });
    });
})






module.exports = router;

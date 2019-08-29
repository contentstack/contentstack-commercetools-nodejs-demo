var express = require('express');
var router = express.Router();
var monetate = require('../lib/monetate.js');
var commercetools = require('../lib/commerce.js');
var fetch = require('node-fetch');
const { key, cluster, channleNamePrefix } = config.realtime;


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
  var Query = Stack.ContentType('home_page_new').Query()
    .language(`${locale}`)
    .toJSON()
    .find()
    .spread(function success(result, count) {


        //console.log('result[0]', result[0]);

      return res.render('pages/home2', {
            data: result[0],
            contentType: "home_page_new",
            trackingId: config.analytics.trackingId,
            url: config.url
          })
      }, function error(error) {
        next(error);
      });
    });

router.get('/', (req, res, next) => {
  res.cookie('locale', 'en-us', "/");
  var Query = Stack.ContentType('home_page_new').Query()
    .language(`en-us`)
    .query({ "locale": `en-us` })
    .toJSON()
    .find()
    .spread(function success(result, count) {

        console.log('result', result[0]);

      //commercetools pricing
      commercetools.getActionsForRequest(req, res).then((products) => {

          return res.render('pages/home2', {
            data: result[0],
            contentType: "home_page_new",
            trackingId: config.analytics.trackingId,
            url: config.url
          })
      }, function error(error) {
        next(error);
      });
    });
})

module.exports = router;
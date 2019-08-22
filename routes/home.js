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
  var Query = Stack.ContentType('homepage_personalised').Query()
    .language(`${locale}`)
    .toJSON()
    .includeCount()
    .includeReference("new_arrivals.products")
    .find()
    .spread(function success(result, count) {
      //commercetools pricing
      commercetools.getActionsForRequest(req, res).then((products) => {
        result[0].new_arrivals.forEach(function (data) {
          data.products.forEach(function (result) {
            if (req.originalUrl.includes("/fr")) {
              result.url = "/" + locale.split("-", 1) + result.url;
            }
            products.results.forEach(function (ids) {
              if (result.product_link.id === ids.id) {
                result.product_link = ids;
              }
            })
          })
        })

        return monetate.getActionsForRequest(req, res).then((actions) => {
          let giftVairant
          let bannerVariant

          try {
            giftVairant = actions.find(a => a.impressionReporting[0].experience_label === "Gifts-New_1027283").json.banner
          } catch (e) {
            console.log('giftVairant', e)
            giftVairant = 0
          }
          try {
            bannerVariant = actions.find(a => a.impressionReporting[0].experience_label === "Banner-Home-Page-New_1027284").json.banner
          } catch (e) {
            console.log('bannerVariant', e)
            bannerVariant = 0
          }

          return res.render('pages/home', {
            data: result[0],
            contentType: "homepage_personalised",
            trackingId: config.analytics.trackingId,
            gift: result[0].card.gift[giftVairant] || result[0].card.gift[0],
            first_banner: result[0].main_banner.first_section[bannerVariant] || result[0].main_banner.first_section[0],
            realtime: { key, cluster, channel: `${config.realtime.channleNamePrefix}-${result[0].uid}`, event: "publish" },
            shop_instagram: result[0].shop_instagram,
            giftVairant,
            bannerVariant,
            monetate: config.monetate,
            url: config.url
          })
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

      //commercetools pricing
      commercetools.getActionsForRequest(req, res).then((products) => {
        result[0].new_arrivals.forEach(function (data) {
          data.products.forEach(function (result) {
            products.results.forEach(function (ids) {
              if (result.product_link.id === ids.id) {
                result.product_link = ids;
              }
            })
          });
        });

        return monetate.getActionsForRequest(req, res).then((actions) => {
          let giftVairant
          let bannerVariant

          try {
            giftVairant = actions.find(a => a.impressionReporting[0].experience_label === "Gifts-New_1027283").json.banner
          } catch (e) {
            console.log('giftVairant', e)
            giftVairant = 0
          }
          try {
            bannerVariant = actions.find(a => a.impressionReporting[0].experience_label === "Banner-Home-Page-New_1027284").json.banner
          } catch (e) {
            console.log('bannerVariant', e)
            bannerVariant = 0
          }

          return res.render('pages/home2', {
            data: result[0],
            contentType: "homepage_personalised",
            trackingId: config.analytics.trackingId,
            gift: result[0].card.gift[giftVairant] || result[0].card.gift[0],
            first_banner: result[0].main_banner.first_section[bannerVariant] || result[0].main_banner.first_section[0],
            realtime: { key, cluster, channel: `${config.realtime.channleNamePrefix}-${result[0].uid}`, event: "publish" },
            shop_instagram: result[0].shop_instagram,
            giftVairant,
            bannerVariant,
            monetate: config.monetate,
            url: config.url
          })
        })
      }, function error(error) {
        next(error);
      });
    });
})

module.exports = router;
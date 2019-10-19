var express = require('express');
var router = express.Router();
var fetch = require('node-fetch');

router.get('/', (req, res, next) => {
  res.cookie('locale', 'en-us', "/");
  var Query = Stack.ContentType('home_page_new').Query()
    .language(`en-us`)
    .query({ "locale": `en-us` })
    .toJSON()
    .find()
    .spread(function success(result, count) {

        console.log('result', result[0]);
        
        return res.render('pages/home', {
            data: result[0],
            contentType: "home_page_new",
            url: config.url
          })
      }, function error(error) {
        next(error);
      //commercetools pricing
    
    });
})

module.exports = router;

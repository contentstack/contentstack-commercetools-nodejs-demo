const async = require('async');

module.exports = function(req, res, next) {
  async.parallel([
    function(callback) {
      let url = req.path.split('/');
      let locale;
      if (req.path.includes('/en')) {
        url = url[2];
        locale = 'en-us';
        res.cookie('locale', locale, '/');
      } else if (req.path.includes('/fr')) {
        url = url[2];
        res.cookie('locale', 'fr-fr', '/');
        locale = 'fr-fr';
      } else {
        res.cookie('locale', 'en-us', '/');
        locale = 'en-us';
        url = url[1];
      }


      const Query = Stack.ContentType('header').Query()
          .language(`${locale}`)
          .query({'locale': `${locale}`})
          .toJSON()
          .only(['title', 'navigation', 'site_logo'])
          .includeReference('navigation.category')
          .find()
          .spread(function success(result) {
            if (result.length !== 0) {
              if (req.path.includes('/fr')) {
                if (req.cookies['locale'] !== undefined) {
                  result[0].navigation.forEach(function(url) {
                    url.category[0].url = '/' + locale.split('-', 1) + url.category[0].url;
                  });
                }
              }
              result[0].url = config.url;
              callback(null, result[0]);
            } else {
              throw new Error('Failed to load site navigation');
            }
          }, function error(error) {
            callback(error);
          });
    },
  ], function(error, success) {
    if (error) return next(error);
    res.locals.header = success[0];
    next();
  });
};

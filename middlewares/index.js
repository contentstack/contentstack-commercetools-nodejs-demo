const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const basicAuth = require('express-basic-auth');

const a = (req, res, next) => {
  basicAuth({
    users: {'admin': 'supersecret'},
  });
  next();
};

router.get('*', a, require('./load-partials'));

module.exports = router;

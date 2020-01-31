const express = require('express');
const router = express.Router();
const basicAuth = require('express-basic-auth');

router.get('*',require('./load-partials'));

module.exports = router;

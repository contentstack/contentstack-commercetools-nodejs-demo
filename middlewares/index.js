var express = require('express');
var router = express.Router();
router.get('*',require('./load-partials'));

module.exports = router;

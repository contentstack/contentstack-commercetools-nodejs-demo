const express = require('express');
const router = express.Router();
router.get('*',require('./load-partials'));
module.exports = router;

const express = require('express');
const router = express.Router();
const broadcast = require('../lib/realtime').broadcast;

router.post('/', (req, res) => {
  res.header("Content-Type", "text/plain");
  res.header("statusCode", "200");
  res.set("Connection", "close");
  res.status(200)
  res.send('success')
  console.log(`${config.realtime.channleNamePrefix}-${req.body.data.entry.uid}`,'publish')
  broadcast(`${config.realtime.channleNamePrefix}-${req.body.data.entry.uid}`,'publish');
});

module.exports = router;

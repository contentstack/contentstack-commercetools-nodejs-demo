var express = require('express');
var router = express.Router();
const basicAuth = require('express-basic-auth')

function a(req,res,next){
	basicAuth({
    	users: { 'admin': 'supersecret' }
	})
	next()
}

router.get('*', a,require('./load-partials'));

module.exports = router;
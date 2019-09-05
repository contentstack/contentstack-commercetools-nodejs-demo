
var bodyParser = require('body-parser')

var { createCart, createOrderFromCart,getCartDetails } = require('../lib/commercetool');

module.exports = (app) => {
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json());
	app.use('/',require('../middlewares'));
	app.use('/createOrder',createOrderFromCart);
	app.use('/createCart',createCart);
	app.use('/cart/:cartId/pay',getCartDetails);
	app.use('/', require('./home2'));
	app.use('/category', require('./category'));
	app.use('/product', require('./product'));
};

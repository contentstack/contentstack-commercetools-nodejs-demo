
var bodyParser = require('body-parser')

module.exports = (app) => {
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json());
	app.use('/',require('../middlewares'));
	app.use('/pay',require('./payment'));
	app.use('/createOrder',require('./order').createOrderFromCart);
	app.use('/createCart', require('./order').createCartFn);
	app.use('/cart/:cartId/pay',require('./order').orderPayment);
	app.use('/', require('./home2'));
	app.use('/category', require('./category'));
	app.use('/:locale/category', require('./category'));
	app.use('/:locale/product', require('./product'));
	app.use('/product', require('./product'));
};
module.exports = (app) => {
	app.use('/', require('../middlewares'));
	app.use('/', require('./landing'));
	app.use('/', require('./home'));
	app.use('/webhook', require('./webhook'));
	app.use('/category', require('./category'));
	app.use('/:locale/category', require('./category'));
	app.use('/:locale/product', require('./product'));
	app.use('/product', require('./product'));
	// app.use('/home2', (req,res)=>{
	// 	console.log("+++++++");
	// 	res.render('pages/home2');
	// });
};
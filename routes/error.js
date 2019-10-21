module.exports = (app) => {
  // catch 404 and forward to error handler
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
	  	next(err);
  });

  // development error handler
  if (app.get('env') === 'development') {
	  	app.use((err, req, res, next) => {
	    	res.status(err.status || 500);
	    	res.render('error/404', {
	      		message: err.message,
	      		error: err,
	    	});
	  	});
  }

  // production error handler
  // error won't be propagated to the page
  if (app.get('env') === 'production') {
    app.use((err, req, res, next) => {
      res.status(err.status || 500);
      res.render('error/404', {
        message: err.message,
        error: {},
      });
    });
  }
};

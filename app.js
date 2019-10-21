/**
 * Module dependencies.
 */
const express = require('express');
const nunjucks = require('nunjucks');
var bodyParser = require('body-parser');
const logger = require('morgan');
const path = require('path');
const Contentstack = require('contentstack');
const cookieParser = require('cookie-parser');
const errorHandler = require('express-error-handler');
var bodyParser = require('body-parser');


const env = process.env.NODE_ENV || 'default';
const _dirname = (process.env.SITE_PATH) ? path.resolve(process.env.SITE_PATH) : process.cwd();
let _env;

// try {
// load environment based configurations
const _path = path.join(_dirname, 'config');
if (env === 'default') {
  _env = require(path.join(_path, 'default'));
} else {
  _env = require(path.join(_path, env));
}

// load globals
global['config'] = _env;
global['Stack'] = Contentstack.Stack({
  api_key: config.contentstack.api_key,
  access_token: config.contentstack.access_token,
  environment: env,
});

const app = express();


// app.use(bodyParser.urlencoded({ extended: false }))

// // parse application/json
// app.use(bodyParser.json());

app.enable('trust proxy');

// Client side pages to fall under ~/views directory
app.set('views', path.join(__dirname, 'views'));

// Setting Nunjucks as default view
nunjucks.configure('views', {
  autoescape: true,
  express: app,
});

app.set('view engine', 'html');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
  extended: true,
}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
// Routes
require('./routes')(app);

// After all your routes...
// Pass a 404 into next(err)
// app.use( errorHandler.httpError(404) );

// } catch (error) {
//     console.error('Did not find configuration for the specified environment');
//     console.error(error);
//     console.error('exiting!');
// }

module.exports = app;

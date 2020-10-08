require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const expressEnforcesSSL = require('express-enforces-ssl');
const webpack = require('webpack');

const api = require('./api');
const db = require('./models');

const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';
const useWebpackDevMiddleware = process.env.USE_WEBPACK_DEV_MIDDLEWARE === 'true';
console.log('process.env.NODE_ENV', process.env.NODE_ENV);

async function run() {
  const app = express();

  app.use(express.static('public'));

  // https://stackoverflow.com/questions/23616371/basic-http-authentication-with-node-and-express-4
  app.use('/', function(req, res, next) {
    const auth = { 
      login: process.env.BASIC_AUTH_LOGIN, 
      password: process.env.BASIC_AUTH_PASSWORD,
    };

    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Verify login and password are set and correct
    if (login && password && login === auth.login && password === auth.password) {
      // Access granted...
      return next();
    }

    // Access denied...
    res.set('WWW-Authenticate', 'Basic realm="401"');
    res.status(401).send('Authentication required.');
  });

  if (useWebpackDevMiddleware) {
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require("webpack-hot-middleware");
    const config = require('../webpack.config.js');
    const compiler = webpack(config);
    app.use(webpackDevMiddleware(compiler));
    app.use(webpackHotMiddleware(compiler));
  } else {
    app.use(express.static('dist'));
  }

  if (isProduction) {
    app.enable('trust proxy');
    app.use(expressEnforcesSSL());
    app.use(express.static('dist'));
  }

  app.use(bodyParser.json());

  app.use('/api', api);

  app.listen(port, () => {
    console.log(`Server is listening on port: ${port}`);
  });
}

module.exports = run;

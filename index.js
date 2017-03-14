const express = require('express');
const helmet = require('helmet');
const winston = require('winston');
const bodyParser = require('body-parser');
const env = require('./src/env');
const q = require('q');
var mongoose = require('mongoose');

var server = express();
var router = require('./src/router');
var PORT = env.PORT || 8000;

// Built-in Promise support is deprecated
mongoose.Promise = q.Promise;

server.use(bodyParser.json());
server.use(helmet());
server.use('/', router);

function _get() {
  return server;
}

function run(fn) {

  fn = fn || function _defaultStart() {
    winston.info('Listening at ' + PORT);
  };

  return server.listen(PORT, fn);
}

if (require.main === module) {
  run();
}

module.exports = {
  _get: _get,
  run: run
};

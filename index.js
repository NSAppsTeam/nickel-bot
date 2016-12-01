const express = require('express');
const helmet = require('helmet');
const winston = require('winston');
const bodyParser = require('body-parser');
const env = require('./src/env');

var server = express();
var router = require('./src/router');
var PORT = env.PORT || 8000;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(helmet());
server.use('/review', router);

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
  run: run
};

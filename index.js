const express = require('express');
const helmet = require('helmet');
const winston = require('winston');
const bodyParser = require('body-parser');

var server = express();
var router = require('./src/router');
var PORT = process.env.PORT || 8000;

server.use(bodyParser.urlencoded({ extended: false }));
server.use(helmet());
server.use('/review', router);

server.listen(PORT, () => {
  winston.info('Listening at ' + PORT);
});

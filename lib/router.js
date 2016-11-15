var express = require('express');
var parseCommand = require('./parse-command');

var router = express.Router();

router.post('/', parseCommand);

module.exports = router;

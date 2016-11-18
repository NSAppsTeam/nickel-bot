var express = require('express');
var parseCommand = require('./parse-command');

var router = express.Router();

router.post('/', (req, res) => {
  parseCommand(req)
  .then(res.send);
});

module.exports = router;

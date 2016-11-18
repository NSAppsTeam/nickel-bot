const express = require('express');
const winston = require('winston');
const parseCommand = require('./parse-command');
const router = express.Router();

router.post('/', (req, res) => {

  parseCommand(req)
  .then((text) => {
    res.status(200).send(text);
  })
  .catch((err) => {
    winston.error(err);
    res.sendStatus(500);
  });
});

module.exports = router;

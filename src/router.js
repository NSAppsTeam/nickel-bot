const express = require('express');
const winston = require('winston');
const db = require('./db');
const CommandParser = require('./command-parser');
const router = express.Router();

db.connect()
.then((instance) => {
  var parser = new CommandParser({
    db: instance
  });

  router.post('/', (req, res) => {

    parser(req)
    .then((text) => {
      res.status(200).send(text);
    })
    .catch((err) => {
      winston.error(err);
      res.sendStatus(500);
    });
  });

});

module.exports = router;

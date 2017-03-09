const express = require('express');
const winston = require('winston');
const db = require('./db');
const Storage = require('./storage').Storage;
const router = express.Router();
const gitlabRouter = express.Router({mergeParams: true});
const SecurityError = require('./errors/security-error');

var storage = new Storage(db.connect());

const TEAM_TOKEN = env.TEAM_TOKEN || Math.random(); // Seriously, you must have it set

/**
 * Match environment token against token from JSON payload
 *
 * @param  {String} token Passed string token
 * @return {Boolean} Returns true if token matches
 */
function validateToken(req) {
  return new Promise((resolve, reject) => {
    if (req.body.token === TEAM_TOKEN) {
      return resolve(req.body);
    }

    reject(new SecurityError('Token does not match team\'s '));
  });
}

function expressify(promisable) {

  return (req, res) => {
    validateToken(req.body)
    .then(promisable)
    .then((payload) => res.status(200).send(payload))
    .catch((err) => {
      winston.error(err);
      res.sendStatus(500);
    });
  };
}

gitlabRouter.route('/')
.post(expressify(storage.merge));

router.use('/gitlab', gitlabRouter);


module.exports = router;

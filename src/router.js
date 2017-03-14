const express = require('express');
const winston = require('winston');
const mergeRequestSchema = require('./merge-request-schema');
const db = require('./db');
const Storage = require('./storage').Storage;
const middleware = require('./middleware');
const router = express.Router();
const gitlabRouter = express.Router({mergeParams: true});

var storage = new Storage({
  connection: db.connect(),
  schema: mergeRequestSchema
});

function expressify(promisable) {

  return (req, res) => {

    promisable(req.body)
    .then((payload) => res.status(200).send(payload))
    .catch((err) => {
      winston.error(err);
      res.sendStatus(500);
    });
  };
}

gitlabRouter.use(middleware.gitlab);
gitlabRouter.route('/merge-request')
.post(expressify(storage.add));

router.use('/gitlab', gitlabRouter);


module.exports = router;

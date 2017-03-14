const express = require('express');
const winston = require('winston');
const rtm = require('./rtm');
const mergeRequestSchema = require('./merge-request-schema');
const db = require('./db');
const Storage = require('./storage').Storage;
const middleware = require('./middleware');
const router = express.Router();
const gitlabRouter = express.Router({mergeParams: true});

rtm.start()
.then(() => {
  winston.debug('Slack RTM has connected');
})
.catch(() => {
  winston.error('Slack RTM has failed to connect.  You will not be able to send messages until this is fixed');
});

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

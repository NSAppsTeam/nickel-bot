const express = require('express');
const winston = require('winston');
const rtm = require('./rtm');
const mergeRequestSchema = require('./merge-request-schema');
const db = require('./db');
const env = require('./env');
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
    .then((msg) => res.status(200).send(msg))
    .catch((err) => {
      winston.error(err);
      res.sendStatus(500);
    });
  };
}

function sendMergeButton(body) {
  return storage.add(body)
  .then((modelObj) => {
    rtm.send.call(rtm, {
      text: 'Merge request opened by ' + modelObj.author.username,
      attachments: [
        {
          fallback: 'Unable to accept merge request',
          callback_id: 'merge_request',
          color: '#db3236',
          attachment_type: 'default',
          actions: [
            {
              name: 'option',
              text: 'Accept',
              type: 'button',
              value: 'accept'
            }
          ]
        }
      ]
    })
    .catch((err) => {
      winston.error(err);
    });
    return 'Created at ' + Date();
  });
}

gitlabRouter.use(middleware.gitlab);
gitlabRouter.route('/merge-request')
.post(expressify(sendMergeButton));

router.use('/gitlab', gitlabRouter);


module.exports = router;

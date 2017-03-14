const winston = require('winston');
const env = require('./env');
const GITLAB_TOKEN = env.GITLAB_TOKEN || Math.random(); // Seriously, you must have it set
const GITLAB_EVENT_NAME = 'Push Hook';

module.exports = {
  /**
   * Middleware for processing Gitlab Merge Hook
   *
   * @param {object} req - Contains request information from express
   * @param {object} res - Express object with interface for communicating back
   * to client user
   * @return {undefined} Should not be consumed
   */
  gitlab: function(req, res, next) {
    if (req.headers['x-gitlab-token'] !== GITLAB_TOKEN) {
      winston.error(new Error('Token does not match team\'s '));
      return res.sendStatus(500);
    }

    if (req.headers['x-gitlab-event'] !== GITLAB_EVENT_NAME) {
      winston.error(new Error('Missing or invalid X-Gitlab-Event header'));
      return res.sendStatus(500);
    }

    next();
  }
};

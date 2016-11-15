const winston = require('winston');

module.exports = (req, res) => {
  winston.info(req.body);
  res.send('OK');
}

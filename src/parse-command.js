const winston = require('winston');
const fs = require('fs');
const SecurityError = require('./errors/security-error');

const COMMAND_FILE = './commands.json';
const TEAM_TOKEN = process.env.TEAM_TOKEN || Math.random(); // Seriously, you must have it set

var commandLookup = new Promise((resolve, reject) => {
  fs.readFile(COMMAND_FILE, 'utf8', (err, contents) => {
    if (err) {
      return reject(err);
    }

    resolve(JSON.parse(contents));
  });
});

function resolveCommand() {

}

function validateToken(token) {
  if (token === TEAM_TOKEN) {
    return true;
  }

  throw new SecurityError('Token does not match team\'s ');
}

module.exports = (req) => {
  return new Promise((resolve, reject) => {
    validateToken(req.body.token);
    winston.info(req.body);
    resolve('OK');
  });
}

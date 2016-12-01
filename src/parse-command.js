const winston = require('winston');
const fs = require('fs');
const _ = require('underscore');

const env = require('./env');
const Direct = require('./direct');
const SecurityError = require('./errors/security-error');

const COMMAND_FILE = './commands.json';
const TEAM_TOKEN = env.TEAM_TOKEN || Math.random(); // Seriously, you must have it set

var commandLookup = new Promise((resolve, reject) => {
  fs.readFile(COMMAND_FILE, 'utf8', (err, contents) => {
    if (err) {
      return reject(err);
    }

    resolve(JSON.parse(contents));
  });
});

function errorWrap(name, message, delimiter) {
  delimiter = delimiter || ':\xa0';

  return 'Error'.concat(delimiter, name, delimiter, message);
}

function buildMsgStk(primary, block) {
  function wrapArg(arg) {
    return '[' + arg + ']';
  }

  var msg = block.name;

  (block.input || []).forEach((input) => {
    msg += '\xa0' + wrapArg(input.type.toUpperCase());
  });

  msg += '\xa0'.repeat(5) + block.desc;
  msg += '\r\n\r\n';
  msg += primary;

  return msg;
}

function verifyInputs(cmdObj) {
  var inputs = Array.prototype.slice.call(arguments[1], 1);
  for (var i = 0; i < inputs.length; i++) {
    var matchInput = cmdObj.input[i] || { type: 'unknown' };

    if (!(typeof (Number(inputs[i]) || inputs[i]) === matchInput.type)) {
      return buildMsgStk(errorWrap('CommandError',
        inputs[i] + ' is an invalid input'), cmdObj);
    }
  }
}

/**
 * Perform requested action by payload
 * @param  {Object} command Command action with arguments
 * @return {Object} Response message by action
 */
function resolveCommand(command) {
  var direct = new Direct(command);

  return commandLookup
  .then((contents) => {
    return _.find(contents.commands, { name: command });
  })
  .then((cmdObj) => {
    if (!cmdObj) {
      return errorWrap('CommandError', String(command) + ' is not a valid command');
    }

    var message = verifyInputs.call(this, cmdObj, arguments);

    if (!message) {
      return direct.execute(command);
    }
  });
}

/**
 * Match environment token against token from JSON payload
 *
 * @param  {String} token Passed string token
 * @return {Boolean} Returns true if token matches
 */
function validateToken(token) {
  if (token === TEAM_TOKEN) {
    return true;
  }

  throw new SecurityError('Token does not match team\'s ');
}


module.exports = (req) => {
  validateToken(req.body.token);
  return resolveCommand.apply(this, req.body.text.split(' '));
};

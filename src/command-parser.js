const env = require('./env');
const commands = require('./commands');
const SecurityError = require('./errors/security-error');

const TEAM_TOKEN = env.TEAM_TOKEN || Math.random(); // Seriously, you must have it set

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

function parse(str) {
  str = str.split(' ');

  return {
    command: str[0],
    num: str[1]
  };
}

function routeToCommand(payload) {
  payload.params = parse(payload.text);

  return commands[payload.command].call(commands, {
    num: payload.params.num,
    user: payload.user_name
  });
}

module.exports = (req) => {
  validateToken(req.body.token);
  return routeToCommand(req.body);
};


function SecurityError(message) {
  this.name = 'SecurityError';
  this.message = message || '';
}

SecurityError.prototype = Error.prototype;

module.exports = SecurityError;

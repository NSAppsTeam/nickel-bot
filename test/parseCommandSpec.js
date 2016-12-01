/* globals describe, beforeEach, it */
const chai = require('chai');
const sandboxedModule = require('sandboxed-module');
const _ = require('underscore');
const SecurityError = require('../src/errors/security-error');

function apply(fn, args) {
  return function() {
    fn(args);
  };
}

describe('parseCommand', () => {
  var expect = chai.expect;
  var parseCommand;
  var env = {
    TEAM_TOKEN: 'foo'
  };

  beforeEach(function() {
    process.env = _.defaults(env, process.env);

    parseCommand = sandboxedModule.require('../src/parse-command', {
      process: process
    });
  });

  it('should throw an error for mismatched token', function() {
    expect(apply(parseCommand, {
      body: {}
    })).to.throw(SecurityError);
  });
});

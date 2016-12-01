/* globals beforeEach, afterEach, it */
const supertest = require('supertest');
const _ = require('underscore');
const fs = require('fs');
const sandboxedModule = require('sandboxed-module');
const env = require('../src/env');

function getServer(path) {
  env.TEAM_TOKEN = 'foo';

  return sandboxedModule.require(path, {
    requires: {
      './src/env': env
    }
  });
}

describe('Payload Testing', () => {
  var server;
  var instance;
  var awake;

  beforeEach(() => {
    server = getServer('../index');
    awake = new Promise((resolve) => {
      instance = server.run(() => {
        resolve();
      });
    });
  });

  afterEach((done) => {
    awake.then(() => {
      instance.close();
      done();
    });
  });

  it('should send command', (done) => {
    supertest(instance)
    .post('/review')
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send({
      token: env.TEAM_TOKEN,
      text: 'accept 10'
    })
    .expect(200, done);
  });

});

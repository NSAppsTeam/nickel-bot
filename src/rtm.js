const RtmClient = require('@slack/client').RtmClient;
const MemoryDataStore = require('@slack/client').MemoryDataStore;
const CLIENT_EVENTS = require('@slack/client').CLIENT_EVENTS;
const RTM_EVENTS = require('@slack/client').RTM_EVENTS:
const winston = require('winston');
const env = require('./env');

var bot_token = env.SLACK_BOT_TOKEN || '';

var rtm = new RtmClient(bot_token, {
  dataStore: new MemoryDataStore()
});

var floodgate = (() => {
  var deferred = {};

  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });

  return deferred;
})();

function start() {
  return new Promise((resolve, reject) => {


    // The client will emit an RTM.AUTHENTICATED event on successful connection, with the `rtm.start` payload if you want to cache it
    rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, function (rtmStartData) {
      winston.debug(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}, but not yet connected to a channel`);
    });

    // you need to wait for the client to fully connect before you can send messages
    rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, (msg) => {
      resolve(msg);
      floodgate.resolve(msg);
    });

    rtm.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, (err) => {
      reject(err);
      floodgate.reject(err);
    });

    rtm.start();
  });
}
module.exports = {
  start: start,

  _invoke: (method) => {
    var args = Array.prototype.slice.call(arguments, 1);

    return floodgate.promise.then(() => {
      return rtm[method].apply(rtm, args);
    });
  },

  send: (message, channel) => {
    var body = {...message};
    body.type = RTM_EVENTS.MESSAGE;
    return this._invoke('send', message, channel);
  },

  sendMessage: (message, channel) => {
    return this._invoke('sendMessage', message, channel);
  }
};

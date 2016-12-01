const db = require('./db');

function promisfy(fn) {
  return new Promise((resolve) => {
    fn(resolve);
  });
}

var _connect = db.connect();

var self = module.exports = {
  _connected: false,

  _instance: null,

  _collection: null,

  _queue: [],

  _connect: () => {
    return _connect
    .then(function(db) {

      this._connected = true;
      this._instance = db;

      return this._instance;

    }.bind(this));
  },

  _tryConnection: (promise) => {
    var loc = 0;
    var promises = [promise];

    if (!this._connected) {
      loc += 1;
      promises.unshift(this._connect);
    }

    return Promise.all(promises)
    .then((vals) => vals[loc]);
  },

  _chk: (fn) => {
    return () => {
      if (this._connected) {

        return promisfy(fn);

      } else {

        return Promise.all([
          this._connect(),
          promisfy(fn)
        ])
        .then((vals) => vals[1]);

      }
    };
  },

  setCollection: (name) => {
    return self._connect()
    .then(function _setCollection() {
      this._collection = this._instance.collection(name);

      return this._collection;
    }.bind(this));
  },

  insert: null
};

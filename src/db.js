const mongoClient = require('mongodb').MongoClient;
const env = require('./env');

const URI = env.MONGOLAB_URI || 'mongodb://localhost:27017/review-bot';

module.exports = {
  _db: null,

  connect: (uri) => {
    var self = this;
    uri = uri || URI;

    return new Promise((resolve, reject) => {
      mongoClient.connect(uri, (err, db) => {
        if (err) {
          return reject(err);
        }

        self._db = db;
        return resolve(self._db);
      });
    });
  }
};

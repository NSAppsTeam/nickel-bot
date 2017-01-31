const mongoClient = require('mongodb').MongoClient;
const env = require('./env');

const URI = env.MONGODB_URI || 'mongodb://localhost:27017/review-bot';

module.exports = {

  connect: (uri) => {
    uri = uri || URI;

    return new Promise((resolve, reject) => {
      mongoClient.connect(uri, (err, db) => {
        if (err) {
          return reject(err);
        }

        return resolve(db);
      });
    });
  }
};

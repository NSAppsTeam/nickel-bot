var commands = {};

var COLL_NAME = 'reviews';

function getCollection(options) {
  var db = options.db;
  return db.collection(COLL_NAME);
}

/**
 * Open merge request along ID with author information
 * @param  {Object} payload Contains merge request information
 * @return {Object}            Promise which resolves with success/failure
 */
commands.accept = (payload, options) => {
  return getCollection(options)
  .updateOne({num: payload.num}, {
    $set: {
      accepted: true,
      reviewer: payload.user
    }
  });
};

commands.close = (payload, options) => {
  getCollection(options)
  .updateOne({num: payload.num}, {
    $set: {
      open: false
    }
  });
};

commands.merge = (payload, options) => {
  return getCollection(options)
  .updateOne({num: payload.num}, {
    $set: {
      open: false,
      reviewer: payload.user
    }
  });
};

commands.comment = (payload, options) => {
  // TODO
};

commands.open = (payload, options) => {
  getCollection(options)
  .insertOne({
    num: payload.num,
    open: true,
    owner: payload.user
  });

  return 'You have opened merge request ' + payload.num;
};

commands.list = (payload, options) => {
  return getCollection(options)
  .find({
    open: true
  });
};

module.exports = commands;

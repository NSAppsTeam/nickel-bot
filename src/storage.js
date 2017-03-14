const mongoose = require('mongoose');
const winston = require('winston');

// TODO: Refactor to separate module?
const transformers = {
  merge_request: function(payload) {
    return {
      merge_request: payload.object_attributes,
      last_commit: payload.last_commit,
      project: payload.target,
      author: payload.user,
      assignee: {
        claimed_on_slack: false,
        name: '',
        username: ''
      }
    };
  }
};

/**
 * Return mapped object for document
 */
function transform(obj) {
  return transformers[obj.object_kind](obj);
}

class Storage {
  constructor(props) {
    this._connection = props.connection;
    this._model = mongoose.model(props.schema.name, props.schema.schema);

    this.add = this.add.bind(this);
  }

  /**
   * Save instance to database using model property
   */
  add(obj) {
    var instance = new this._model(transform(obj));
    return instance.save()
    .then((res) => {
      winston.debug(res);
      return 'Created at ' + Date();
    });
  }
}

module.exports = {
  Storage
};

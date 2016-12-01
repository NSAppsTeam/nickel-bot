const pooling = require('./pooling');
const COLLECTION = 'reviews';

function direct(command, obj, collection = COLLECTION) {
  pooling.setCollection(collection);
}

direct.prototype.accept = (command) => {
  pooling.insert(command);
};

direct.prototype.execute = () => {
  // TODO
};

module.exports = direct;

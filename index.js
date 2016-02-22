var init = require('./lib/init');

module.exports = {
  Client: init.Client,
  Producer: init.Producer,
  createStream: init.createStream
};

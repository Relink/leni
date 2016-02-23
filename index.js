var init = require('./lib/init');
var emitter = require('./lib/emitter');

module.exports = {
  Client: init.Client,
  Producer: init.Producer,
  createStream: init.createStream,
  sendMessage: emitter.sendMessage
};

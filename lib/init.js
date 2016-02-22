var Promise = require('bluebird');
var kafka = require('kafka-node');
Promise.promisifyAll(kafka);
var Consumer = kafka.HighLevelConsumer;
var _ = require('lodash');


var emitter = require('./emitter');
var init = {};

init._initEmitters = function _initEmitters (producer, consumers) {
  var producerReady = new Promise(function (resolve, reject) {
    producer.on('ready', resolve);
    producer.on('error', reject);
  });

  // After producer is ready, create & return the combined emitter.
  return producerReady
    .then(emitter.combineEmitters.bind(null,
                               _.concat(consumers, producer),
                               ['message', 'error']));
};

init.createStream = function createStream (client, producer, consumerOptions) {

  if (!_.isFunction(producer.on)) {
    return Promise.reject(TypeError('createStream requires a producer with the EventEmitter interface'));
  };

  var consumers = consumerOptions.map(c => new Consumer(client, c.payloads, c.options));
  return init._initEmitters(producer, consumers);
};

init.Client = kafka.Client;
init.Producer = kafka.HighLevelProducer;
module.exports = init;

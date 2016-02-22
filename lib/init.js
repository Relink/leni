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

/**
 * createStream creates an EventEmitter that combines all error events from the
 * kafka-node producer and creates consumers for every set of consumer options provided.
 * All consumers emit on the 'messages' channel and all errors are emitted
 * on the 'errors' channel.
 *
 * @param {Object} client a kafka-node client.
 * @param {Object} producer a kafka-node Producer.
 * @param {Array} consumerOptions in the format: { payloads: Object, options: object }.
 * See kafka-node for the format of the payloads object and the options object
 * for HighLevelConsumer.
 * @returns {Promise} that resolves to an EventEmitter.
 */
init.createStream = function createStream (client, producer, consumerOptions) {

  // Throw an error if the producer does not conform to EventEmitter interface!
  if (!_.isFunction(producer.on)) {
    return Promise.reject(TypeError('createStream requires a producer with the ' +
                                    'EventEmitter interface'));
  };

  var consumers = consumerOptions.map(c => new Consumer(client, c.payloads, c.options));
  return init._initEmitters(producer, consumers);
};

init.Client = kafka.Client;
init.Producer = kafka.HighLevelProducer;
module.exports = init;

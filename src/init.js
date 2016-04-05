var Promise = require('bluebird');
var kafka = require('kafka-node');
Promise.promisifyAll(kafka);
var _ = require('lodash');
var Leni = require('./Leni');

var init = {};

init._initOnReady = function (ee) {
  return new Promise((resolve, reject) => {
    ee.on('ready', resolveEmitter);
    ee.on('error', rejectEmitter);

    function resolveEmitter() {
      ee.removeListener('ready', resolveEmitter);
      resolve(ee);
    };

    function rejectEmitter(err) {
      ee.removeListener('error', rejectEmitter);
      reject(err);
    };
  });
};

init._initClient = function initClient({connectionString, clientId,
                                       zkOptions, noAckBatchOptions} = {}) {
  var client = new kafka.Client(connectionString, clientId, zkOptions, noAckBatchOptions);
  return init._initOnReady(client);
};

init._initProducer = function initProducer(client, producerOpts) {
  return Promise.resolve(new kafka.HighLevelProducer(client, producerOpts));
};

init._initConsumer = function initConsumer(client, payloads, consumerOpts) {
  return Promise.resolve(new kafka.HighLevelConsumer(client, payloads, consumerOpts));
};

/**
 *
 * @param {Object} clientOpts
 * @param {Object} clientOpts.connectionString
 * @param {Object} clientOpts.clientId
 * @param {Object} clientOpts.zkOptions
 * @param {Object} clientOpts.noAckBatchOptions
 * @param {Object} consumerOpts
 * @param {Object} consumerOpts.payloads the payloads as per kafka-node
 * @param {Object} consumerOpts.optins the options as per kafka-node
 * @param {Object} producerOpts
 * @returns {Promise} resolves with instance of Leni class when the connection
 * to the client and the connection to the producer are created and recieved
 * the ready event.
 */
init.connect = function connect (clientOpts,
                                 {payloads, options} = {},
                                 producerOpts) {
  var client, consumer, producer;

  return init._initClient(clientOpts)
    .then(_client => {
      client = _client;
      return payloads && init._initConsumer(client, payloads, options);
    })
    .then(_consumer => {
      consumer = _consumer;
      return producerOpts && init._initProducer(client, producerOpts);
    })
    .then(_producer => {
      producer = _producer;
      return new Leni(client, consumer, producer);
    });
};

module.exports = init;

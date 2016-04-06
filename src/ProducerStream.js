var _ = require('lodash');
var stream = require('stream');
var eddies = require('@relinklabs/eddies');
var EventEmitter = require('events').EventEmitter;

class ProducerStream {

  /**
   * ProducerStream returns a stream that produces whatever the hell it wants
   * @param {} producer
   * @param {Object} options
   * @param {Boolean} [options.duplex = false] indicates whether you intend to
   * use this as a writable stream (not piping into anything else) or a
   * duplex stream (piping results from the kafka publishing into something else).
   * @returns {}
   */
  constructor (producer, {duplex = false} = {}) {
    var _producer = producer;
    var producerStream = eddies.create({number: 10, errorCount: 10}, msg => {
      return this.constructor._sendMessage(_producer, msg)
        .then(data => ({ message: data }))
    })
    if (!duplex) {
      producerStream.pipe(new stream.Writable({
        objectMode: true,
        write: (d,e,c) => c()
      }));
    }
    return producerStream;
  }

  /**
   * sendMessage puts messages onto the Kafka queue!
   *
   * @param {Object} producer a node-kafka producer, created by leni.
   * @param {Object} data a pojo that is the message to be sent.
   * @param {String} topic the Kafka topic that the message should be sent on.
   * @returns {Promise} that resolves or rejects based on callback from
   * node-kafka producer.
   */
  static _sendMessage (producer, data) {

    // producer must be a instance of the node-kafka Producer! Otherwise, reject.
    if (typeof producer.sendAsync != 'function') {
      return Promise.reject(new TypeError('sendMessage requires a kafka producer, and the ' +
                                          'object you passed does not look look like one!'));
    }

    // If there is no data, reject!
    if (!data) {
      return Promise.reject(new TypeError('sendMessage requires something to send!!'));
    }
    return producer.sendAsync(data);
  };
}


module.exports = ProducerStream;

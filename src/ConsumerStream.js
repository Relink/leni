var _ = require('lodash');
var util = require('util');
var Readable = require('stream').Readable;

/**
 * ConsumerStream extends Stream.Readable, creates a stream out of node-kafka
 * consumer that will
 * @param {EventEmitter} consumer node-kafka consumer to wrap in stream.
 * @param {Object} options standard node stream.Readable options.
 */
class ConsumerStream extends Readable {

  constructor (consumer, options) {
    options = _.merge({ objectMode: true }, options);
    super(options);
    this._consumer = consumer;

    this._consumer.on('message', msg => {

      // if push() returns false, then we need to stop reading from source
      if (!this.push(msg)) {

        // if message push failed, set the consumer offset back to the failed
        // message so that it is not lost!
        this._consumer.pause();
      };
    });

    // NOTE: We could listen to the 'done' event, but the consumer sends this
    // event over and over again if it's at the end of its queue, causing havoc.
    // Right now I can't see why we need to listen to the done event anyways?
    this._consumer.on('error', err => this.emit('error', err));

    // node-kafka consumers do not necessarily begin paused, so we force it here.
    this._consumer.pause();
  }

  _read () {
    if (this._consumer.paused) {
      this._consumer.resume();
    }
  }
}

module.exports = ConsumerStream;

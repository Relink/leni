var _ = require('lodash');
var util = require('util');
var Readable = require('stream').Readable;
util.inherits(ConsumerStream, Readable);

/**
 * ConsumerStream extends Stream.Readable, creates a stream out of node-kafka
 * consumer that will
 * @param {EventEmitter} consumer node-kafka consumer to wrap in stream.
 * @param {Object} options standard node stream.Readable options.
 */
function ConsumerStream(consumer, options) {

  // LISTEN TO CLIENT ERRORS???

  // what to set highWaterMark???
  options = _.merge({ objectMode: true }, options);
  Readable.call(this, options);
  this._consumer = consumer;

  this._consumer.on('message', msg => {

    // if push() returns false, then we need to stop reading from source
    if (!this.push(msg)) {

      // if message push failed, set the consumer offset back to the failed
      // message so that it is not lost!
      this._consumer.pause();
      this._consumer.setOffset(msg.topic, msg.partition, msg.offset);
    };
  });

  this._consumer.on('error', err => this.emit('error', err));
  this._consumer.on('done', () => this.push(null));

  // node-kafka consumers do not necessarily begin paused, so we force it here.
  this._consumer.pause();
};


// _read will be called when the stream wants to pull more data in
// the advisory size argument is ignored in this case.
ConsumerStream.prototype._read = function(size) {
  this._consumer.resume();
};

module.exports = ConsumerStream;

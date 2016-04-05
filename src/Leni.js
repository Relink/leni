var ConsumerStream = require('./ConsumerStream');
var ProducerStream = require('./ProducerStream');
var FormatStream = require('./FormatStream');

/*
 * This is what you get when you initialize the library.
 */
class Leni {
  constructor(client, consumer, producer) {
    this.client = client;
    this.consumer = consumer;
    this.producer = producer;
  };

  consumerStream(options) {
    return this.constructor.createStream(ConsumerStream, this.consumer, options);
  };

  producerStream(options) {
    return this.constructor.createStream(ProducerStream, this.producer, options);
  };

  formatStream(topic) {
    return new FormatStream(topic);
  };

  sendMessage(msg) {
    return ProducerStream._sendMessage(this.producer, msg);
  };

  close() {
    return this.client.closeAsync();
  }

  static createStream(stream, source, options){
    if (!stream){
      throw new Error('you need to properly setup a ' + source + ' to get a stream!');
    }
    return new stream(source, options);
  }
};

module.exports = Leni;

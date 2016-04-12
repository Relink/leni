var stream = require('stream');
var _ = require('lodash');

class FormatStream extends stream.Transform {

  /**
   * FormatStream will format data to be consumed by the node-kafka
   * library. It can be created to either format every piece of data
   * it recieves as the topic it is given, or it can be passed a topic
   * transformation function that is called with each individual piece of
   * data and is expected to return a string representation of the topic.
   * @param {String|Function} topic the string or transformation function
   * that returns the desired topic.
   * @throws {TypeError} if topic fails to return a string.
   * @returns {Stream}
   */
  constructor (topic) {
    if (!topic) {
      throw new Error('FormatStream requires a topic to format!')
    }
    super({
      objectMode: true,
      transform: (data, enc, cb) => {
        try {
          cb(null, this.constructor._formatPayload(data, topic));
        }
        catch (e) { cb(e) };
      }
    });
  };

  /**
   * Formats a piece of data, either an array or single object, into the expected
   * format required by Kafka producers.
   *
   * @param {Object} data whatever js object you want stringified and sent in the message.
   * @param {String} topic the Kafka topic the message should go out on.
   * @returns {Object} with 'topic' and 'messages' keys.
   * @throws {TypeError} if not given a string as a topic
   */
  static _formatPayload (data, topic) {
    topic = typeof topic == 'function' ? topic(data) : topic;

    if (typeof topic != 'string') {
      throw new TypeError('topic transformation function did not return' +
                          'a string. It returned: ' + topic);
    }

    // coerce data into array if it isn't already
    var data = [].concat(data);
    var messages = _.map(data, JSON.stringify);

    // format for kafka-node
    return [{
      topic: topic,
      messages: messages
    }];
  };

};

module.exports = FormatStream

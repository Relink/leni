var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var emitter = {};

/**
 * Provides a way to combine any number of event emitters, along with a specified
 * list of topics, into a single emitter. Used to consolidate errors from kafka
 * producers.
 *
 * TODO: We need a way to remove these listeners and confirm NO memory leaks!!!
 *
 * @param {Array} originals Array of object conforming to the EventEmitter interface.
 * @param {Array} topics Array of Strings, list of every topic to be included in the new
 * emitter. Note that all emitters recieve listeners on all topics.
 * @returns {EventEmitter}
 */
emitter.combineEmitters = function combineEmitters (originals, topics) {
  var ee = new EventEmitter();
  originals.forEach( original => {

    // Throw if the original "emitters" do not conform to the "on" interface
    if (!_.isFunction(original.on)) {
      throw new TypeError('combineEmitters requires an array of objects that conform' +
                         ' to the EventEmitter interface and include an "on" method');
    };

    // Add each topic to each emitter.
    topics.forEach( topic => {
      original.on(topic, (msg) => ee.emit(topic, msg));
    });
  });
  return ee;
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
emitter.formatPayload = function formatPayload (data, topic) {

  // Topic is required and must be a string!
  if (!topic || typeof topic != 'string') {
    throw new TypeError('formatData requires a topic, none given!')
  }

  // coerce data into array if it isn't already
  var data = [].concat(data);

  // Format the data as we want it, according to node-kafka API
  return _.map(data, function (item) {

    // Coerce all our js object types into strings for serializing
    if (item instanceof Object) {
      item = JSON.stringify(item)
    };

    return {
      topic: topic,
      messages: item // is this the best way to communicate it?
    };
  });
};

module.exports = emitter;

'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var stream = require('stream');
var _ = require('lodash');

var FormatStream = function (_stream$Transform) {
  _inherits(FormatStream, _stream$Transform);

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

  function FormatStream(topic) {
    var _this;

    _classCallCheck(this, FormatStream);

    if (!topic) {
      throw new Error('FormatStream requires a topic to format!');
    }
    return _this = _possibleConstructorReturn(this, Object.getPrototypeOf(FormatStream).call(this, {
      objectMode: true,
      transform: function transform(data, enc, cb) {
        try {
          cb(null, _this.constructor._formatPayload(data, topic));
        } catch (e) {
          cb(e);
        };
      }
    }));
  }

  _createClass(FormatStream, null, [{
    key: '_formatPayload',


    /**
     * Formats a piece of data, either an array or single object, into the expected
     * format required by Kafka producers.
     *
     * @param {Object} data whatever js object you want stringified and sent in the message.
     * @param {String} topic the Kafka topic the message should go out on.
     * @returns {Object} with 'topic' and 'messages' keys.
     * @throws {TypeError} if not given a string as a topic
     */
    value: function _formatPayload(data, topic) {
      topic = typeof topic == 'function' ? topic(data) : topic;

      if (typeof topic != 'string') {
        throw new TypeError('topic transformation function did not return' + 'a string. It returned: ' + topic);
      }

      // coerce data into array if it isn't already
      var data = [].concat(data);
      var messages = _.map(data, JSON.stringify);

      // format for kafka-node
      return [{
        topic: topic,
        messages: messages
      }];
    }
  }]);

  return FormatStream;
}(stream.Transform);

;

module.exports = FormatStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Gb3JtYXRTdHJlYW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQUksU0FBUyxRQUFRLFFBQVIsQ0FBVDtBQUNKLElBQUksSUFBSSxRQUFRLFFBQVIsQ0FBSjs7SUFFRTs7Ozs7Ozs7Ozs7Ozs7O0FBYUosV0FiSSxZQWFKLENBQWEsS0FBYixFQUFvQjs7OzBCQWJoQixjQWFnQjs7QUFDbEIsUUFBSSxDQUFDLEtBQUQsRUFBUTtBQUNWLFlBQU0sSUFBSSxLQUFKLENBQVUsMENBQVYsQ0FBTixDQURVO0tBQVo7MEVBZEUseUJBaUJJO0FBQ0osa0JBQVksSUFBWjtBQUNBLGlCQUFXLG1CQUFDLElBQUQsRUFBTyxHQUFQLEVBQVksRUFBWixFQUFtQjtBQUM1QixZQUFJO0FBQ0YsYUFBRyxJQUFILEVBQVMsTUFBSyxXQUFMLENBQWlCLGNBQWpCLENBQWdDLElBQWhDLEVBQXNDLEtBQXRDLENBQVQsRUFERTtTQUFKLENBR0EsT0FBTyxDQUFQLEVBQVU7QUFBRSxhQUFHLENBQUgsRUFBRjtTQUFWLENBSjRCO09BQW5CO1FBTks7R0FBcEI7O2VBYkk7Ozs7Ozs7Ozs7Ozs7bUNBcUNtQixNQUFNLE9BQU87QUFDbEMsY0FBUSxPQUFPLEtBQVAsSUFBZ0IsVUFBaEIsR0FBNkIsTUFBTSxJQUFOLENBQTdCLEdBQTJDLEtBQTNDLENBRDBCOztBQUdsQyxVQUFJLE9BQU8sS0FBUCxJQUFnQixRQUFoQixFQUEwQjtBQUM1QixjQUFNLElBQUksU0FBSixDQUFjLGlEQUNBLHlCQURBLEdBQzRCLEtBRDVCLENBQXBCLENBRDRCO09BQTlCOzs7QUFIa0MsVUFTOUIsT0FBTyxHQUFHLE1BQUgsQ0FBVSxJQUFWLENBQVAsQ0FUOEI7QUFVbEMsVUFBSSxXQUFXLEVBQUUsR0FBRixDQUFNLElBQU4sRUFBWSxLQUFLLFNBQUwsQ0FBdkI7OztBQVY4QixhQWEzQixDQUFDO0FBQ04sZUFBTyxLQUFQO0FBQ0Esa0JBQVUsUUFBVjtPQUZLLENBQVAsQ0Fia0M7Ozs7U0FyQ2hDO0VBQXFCLE9BQU8sU0FBUDs7QUF3RDFCOztBQUVELE9BQU8sT0FBUCxHQUFpQixZQUFqQiIsImZpbGUiOiJGb3JtYXRTdHJlYW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xuXG5jbGFzcyBGb3JtYXRTdHJlYW0gZXh0ZW5kcyBzdHJlYW0uVHJhbnNmb3JtIHtcblxuICAvKipcbiAgICogRm9ybWF0U3RyZWFtIHdpbGwgZm9ybWF0IGRhdGEgdG8gYmUgY29uc3VtZWQgYnkgdGhlIG5vZGUta2Fma2FcbiAgICogbGlicmFyeS4gSXQgY2FuIGJlIGNyZWF0ZWQgdG8gZWl0aGVyIGZvcm1hdCBldmVyeSBwaWVjZSBvZiBkYXRhXG4gICAqIGl0IHJlY2lldmVzIGFzIHRoZSB0b3BpYyBpdCBpcyBnaXZlbiwgb3IgaXQgY2FuIGJlIHBhc3NlZCBhIHRvcGljXG4gICAqIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uIHRoYXQgaXMgY2FsbGVkIHdpdGggZWFjaCBpbmRpdmlkdWFsIHBpZWNlIG9mXG4gICAqIGRhdGEgYW5kIGlzIGV4cGVjdGVkIHRvIHJldHVybiBhIHN0cmluZyByZXByZXNlbnRhdGlvbiBvZiB0aGUgdG9waWMuXG4gICAqIEBwYXJhbSB7U3RyaW5nfEZ1bmN0aW9ufSB0b3BpYyB0aGUgc3RyaW5nIG9yIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9uXG4gICAqIHRoYXQgcmV0dXJucyB0aGUgZGVzaXJlZCB0b3BpYy5cbiAgICogQHRocm93cyB7VHlwZUVycm9yfSBpZiB0b3BpYyBmYWlscyB0byByZXR1cm4gYSBzdHJpbmcuXG4gICAqIEByZXR1cm5zIHtTdHJlYW19XG4gICAqL1xuICBjb25zdHJ1Y3RvciAodG9waWMpIHtcbiAgICBpZiAoIXRvcGljKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Zvcm1hdFN0cmVhbSByZXF1aXJlcyBhIHRvcGljIHRvIGZvcm1hdCEnKVxuICAgIH1cbiAgICBzdXBlcih7XG4gICAgICBvYmplY3RNb2RlOiB0cnVlLFxuICAgICAgdHJhbnNmb3JtOiAoZGF0YSwgZW5jLCBjYikgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIGNiKG51bGwsIHRoaXMuY29uc3RydWN0b3IuX2Zvcm1hdFBheWxvYWQoZGF0YSwgdG9waWMpKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkgeyBjYihlKSB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGb3JtYXRzIGEgcGllY2Ugb2YgZGF0YSwgZWl0aGVyIGFuIGFycmF5IG9yIHNpbmdsZSBvYmplY3QsIGludG8gdGhlIGV4cGVjdGVkXG4gICAqIGZvcm1hdCByZXF1aXJlZCBieSBLYWZrYSBwcm9kdWNlcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIHdoYXRldmVyIGpzIG9iamVjdCB5b3Ugd2FudCBzdHJpbmdpZmllZCBhbmQgc2VudCBpbiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHRvcGljIHRoZSBLYWZrYSB0b3BpYyB0aGUgbWVzc2FnZSBzaG91bGQgZ28gb3V0IG9uLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSB3aXRoICd0b3BpYycgYW5kICdtZXNzYWdlcycga2V5cy5cbiAgICogQHRocm93cyB7VHlwZUVycm9yfSBpZiBub3QgZ2l2ZW4gYSBzdHJpbmcgYXMgYSB0b3BpY1xuICAgKi9cbiAgc3RhdGljIF9mb3JtYXRQYXlsb2FkIChkYXRhLCB0b3BpYykge1xuICAgIHRvcGljID0gdHlwZW9mIHRvcGljID09ICdmdW5jdGlvbicgPyB0b3BpYyhkYXRhKSA6IHRvcGljO1xuXG4gICAgaWYgKHR5cGVvZiB0b3BpYyAhPSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndG9waWMgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb24gZGlkIG5vdCByZXR1cm4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Egc3RyaW5nLiBJdCByZXR1cm5lZDogJyArIHRvcGljKTtcbiAgICB9XG5cbiAgICAvLyBjb2VyY2UgZGF0YSBpbnRvIGFycmF5IGlmIGl0IGlzbid0IGFscmVhZHlcbiAgICB2YXIgZGF0YSA9IFtdLmNvbmNhdChkYXRhKTtcbiAgICB2YXIgbWVzc2FnZXMgPSBfLm1hcChkYXRhLCBKU09OLnN0cmluZ2lmeSk7XG5cbiAgICAvLyBmb3JtYXQgZm9yIGthZmthLW5vZGVcbiAgICByZXR1cm4gW3tcbiAgICAgIHRvcGljOiB0b3BpYyxcbiAgICAgIG1lc3NhZ2VzOiBtZXNzYWdlc1xuICAgIH1dO1xuICB9O1xuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEZvcm1hdFN0cmVhbVxuIl19
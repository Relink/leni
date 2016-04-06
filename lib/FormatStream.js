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
      transform: function transform(d, r, cb) {
        try {
          var t = typeof topic == 'function' ? topic(d) : topic;
          if (typeof t != 'string') {
            throw new TypeError('topic transformation function did not return' + 'a string. It returned: ' + t);
          }
          cb(null, _this.constructor._formatPayload(d, t));
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

      // Topic is required and must be a string!
      if (!topic || typeof topic != 'string') {
        throw new TypeError('formatData requires a topic, none given!');
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Gb3JtYXRTdHJlYW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQUksU0FBUyxRQUFRLFFBQVIsQ0FBVDtBQUNKLElBQUksSUFBSSxRQUFRLFFBQVIsQ0FBSjs7SUFFRTs7Ozs7Ozs7Ozs7Ozs7O0FBYUosV0FiSSxZQWFKLENBQWEsS0FBYixFQUFvQjs7OzBCQWJoQixjQWFnQjs7QUFDbEIsUUFBSSxDQUFDLEtBQUQsRUFBUTtBQUNWLFlBQU0sSUFBSSxLQUFKLENBQVUsMENBQVYsQ0FBTixDQURVO0tBQVo7MEVBZEUseUJBaUJJO0FBQ0osa0JBQVksSUFBWjtBQUNBLGlCQUFXLG1CQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sRUFBUCxFQUFjO0FBQ3ZCLFlBQUk7QUFDRixjQUFJLElBQUksT0FBTyxLQUFQLElBQWdCLFVBQWhCLEdBQTZCLE1BQU0sQ0FBTixDQUE3QixHQUF3QyxLQUF4QyxDQUROO0FBRUYsY0FBSSxPQUFPLENBQVAsSUFBWSxRQUFaLEVBQXNCO0FBQ3hCLGtCQUFNLElBQUksU0FBSixDQUFjLGlEQUNBLHlCQURBLEdBQzRCLENBRDVCLENBQXBCLENBRHdCO1dBQTFCO0FBSUEsYUFBRyxJQUFILEVBQVMsTUFBSyxXQUFMLENBQWlCLGNBQWpCLENBQWdDLENBQWhDLEVBQW1DLENBQW5DLENBQVQsRUFORTtTQUFKLENBUUEsT0FBTyxDQUFQLEVBQVU7QUFBRSxhQUFHLENBQUgsRUFBRjtTQUFWLENBVHVCO09BQWQ7UUFOSztHQUFwQjs7ZUFiSTs7Ozs7Ozs7Ozs7OzttQ0EwQ21CLE1BQU0sT0FBTzs7O0FBR2xDLFVBQUksQ0FBQyxLQUFELElBQVUsT0FBTyxLQUFQLElBQWdCLFFBQWhCLEVBQTBCO0FBQ3RDLGNBQU0sSUFBSSxTQUFKLENBQWMsMENBQWQsQ0FBTixDQURzQztPQUF4Qzs7O0FBSGtDLFVBUTlCLE9BQU8sR0FBRyxNQUFILENBQVUsSUFBVixDQUFQLENBUjhCO0FBU2xDLFVBQUksV0FBVyxFQUFFLEdBQUYsQ0FBTSxJQUFOLEVBQVksS0FBSyxTQUFMLENBQXZCOzs7QUFUOEIsYUFZM0IsQ0FBQztBQUNOLGVBQU8sS0FBUDtBQUNBLGtCQUFVLFFBQVY7T0FGSyxDQUFQLENBWmtDOzs7O1NBMUNoQztFQUFxQixPQUFPLFNBQVA7O0FBNEQxQjs7QUFFRCxPQUFPLE9BQVAsR0FBaUIsWUFBakIiLCJmaWxlIjoiRm9ybWF0U3RyZWFtLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIHN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xudmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcblxuY2xhc3MgRm9ybWF0U3RyZWFtIGV4dGVuZHMgc3RyZWFtLlRyYW5zZm9ybSB7XG5cbiAgLyoqXG4gICAqIEZvcm1hdFN0cmVhbSB3aWxsIGZvcm1hdCBkYXRhIHRvIGJlIGNvbnN1bWVkIGJ5IHRoZSBub2RlLWthZmthXG4gICAqIGxpYnJhcnkuIEl0IGNhbiBiZSBjcmVhdGVkIHRvIGVpdGhlciBmb3JtYXQgZXZlcnkgcGllY2Ugb2YgZGF0YVxuICAgKiBpdCByZWNpZXZlcyBhcyB0aGUgdG9waWMgaXQgaXMgZ2l2ZW4sIG9yIGl0IGNhbiBiZSBwYXNzZWQgYSB0b3BpY1xuICAgKiB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbiB0aGF0IGlzIGNhbGxlZCB3aXRoIGVhY2ggaW5kaXZpZHVhbCBwaWVjZSBvZlxuICAgKiBkYXRhIGFuZCBpcyBleHBlY3RlZCB0byByZXR1cm4gYSBzdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIHRvcGljLlxuICAgKiBAcGFyYW0ge1N0cmluZ3xGdW5jdGlvbn0gdG9waWMgdGhlIHN0cmluZyBvciB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvblxuICAgKiB0aGF0IHJldHVybnMgdGhlIGRlc2lyZWQgdG9waWMuXG4gICAqIEB0aHJvd3Mge1R5cGVFcnJvcn0gaWYgdG9waWMgZmFpbHMgdG8gcmV0dXJuIGEgc3RyaW5nLlxuICAgKiBAcmV0dXJucyB7U3RyZWFtfVxuICAgKi9cbiAgY29uc3RydWN0b3IgKHRvcGljKSB7XG4gICAgaWYgKCF0b3BpYykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGb3JtYXRTdHJlYW0gcmVxdWlyZXMgYSB0b3BpYyB0byBmb3JtYXQhJylcbiAgICB9XG4gICAgc3VwZXIoe1xuICAgICAgb2JqZWN0TW9kZTogdHJ1ZSxcbiAgICAgIHRyYW5zZm9ybTogKGQsIHIsIGNiKSA9PiB7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgdmFyIHQgPSB0eXBlb2YgdG9waWMgPT0gJ2Z1bmN0aW9uJyA/IHRvcGljKGQpIDogdG9waWM7XG4gICAgICAgICAgaWYgKHR5cGVvZiB0ICE9ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCd0b3BpYyB0cmFuc2Zvcm1hdGlvbiBmdW5jdGlvbiBkaWQgbm90IHJldHVybicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnYSBzdHJpbmcuIEl0IHJldHVybmVkOiAnICsgdCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNiKG51bGwsIHRoaXMuY29uc3RydWN0b3IuX2Zvcm1hdFBheWxvYWQoZCwgdCkpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlKSB7IGNiKGUpIH07XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEZvcm1hdHMgYSBwaWVjZSBvZiBkYXRhLCBlaXRoZXIgYW4gYXJyYXkgb3Igc2luZ2xlIG9iamVjdCwgaW50byB0aGUgZXhwZWN0ZWRcbiAgICogZm9ybWF0IHJlcXVpcmVkIGJ5IEthZmthIHByb2R1Y2Vycy5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgd2hhdGV2ZXIganMgb2JqZWN0IHlvdSB3YW50IHN0cmluZ2lmaWVkIGFuZCBzZW50IGluIHRoZSBtZXNzYWdlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gdG9waWMgdGhlIEthZmthIHRvcGljIHRoZSBtZXNzYWdlIHNob3VsZCBnbyBvdXQgb24uXG4gICAqIEByZXR1cm5zIHtPYmplY3R9IHdpdGggJ3RvcGljJyBhbmQgJ21lc3NhZ2VzJyBrZXlzLlxuICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IGlmIG5vdCBnaXZlbiBhIHN0cmluZyBhcyBhIHRvcGljXG4gICAqL1xuICBzdGF0aWMgX2Zvcm1hdFBheWxvYWQgKGRhdGEsIHRvcGljKSB7XG5cbiAgICAvLyBUb3BpYyBpcyByZXF1aXJlZCBhbmQgbXVzdCBiZSBhIHN0cmluZyFcbiAgICBpZiAoIXRvcGljIHx8IHR5cGVvZiB0b3BpYyAhPSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignZm9ybWF0RGF0YSByZXF1aXJlcyBhIHRvcGljLCBub25lIGdpdmVuIScpXG4gICAgfVxuXG4gICAgLy8gY29lcmNlIGRhdGEgaW50byBhcnJheSBpZiBpdCBpc24ndCBhbHJlYWR5XG4gICAgdmFyIGRhdGEgPSBbXS5jb25jYXQoZGF0YSk7XG4gICAgdmFyIG1lc3NhZ2VzID0gXy5tYXAoZGF0YSwgSlNPTi5zdHJpbmdpZnkpO1xuXG4gICAgLy8gZm9ybWF0IGZvciBrYWZrYS1ub2RlXG4gICAgcmV0dXJuIFt7XG4gICAgICB0b3BpYzogdG9waWMsXG4gICAgICBtZXNzYWdlczogbWVzc2FnZXNcbiAgICB9XTtcbiAgfTtcblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBGb3JtYXRTdHJlYW1cbiJdfQ==
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

      // Format the data as we want it, according to node-kafka API
      return _.map(data, function (item) {

        // Coerce all our js object types into strings for serializing
        if (item instanceof Object) {
          item = JSON.stringify(item);
        };

        return {
          topic: topic,
          messages: item // is this the best way to communicate it?
        };
      });
    }
  }]);

  return FormatStream;
}(stream.Transform);

;

module.exports = FormatStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Gb3JtYXRTdHJlYW0uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLElBQUksU0FBUyxRQUFRLFFBQVIsQ0FBVDtBQUNKLElBQUksSUFBSSxRQUFRLFFBQVIsQ0FBSjs7SUFFRTs7Ozs7Ozs7Ozs7Ozs7O0FBYUosV0FiSSxZQWFKLENBQWEsS0FBYixFQUFvQjs7OzBCQWJoQixjQWFnQjs7QUFDbEIsUUFBSSxDQUFDLEtBQUQsRUFBUTtBQUNWLFlBQU0sSUFBSSxLQUFKLENBQVUsMENBQVYsQ0FBTixDQURVO0tBQVo7MEVBZEUseUJBaUJJO0FBQ0osa0JBQVksSUFBWjtBQUNBLGlCQUFXLG1CQUFDLENBQUQsRUFBSSxDQUFKLEVBQU8sRUFBUCxFQUFjO0FBQ3ZCLFlBQUk7QUFDRixjQUFJLElBQUksT0FBTyxLQUFQLElBQWdCLFVBQWhCLEdBQTZCLE1BQU0sQ0FBTixDQUE3QixHQUF3QyxLQUF4QyxDQUROO0FBRUYsY0FBSSxPQUFPLENBQVAsSUFBWSxRQUFaLEVBQXNCO0FBQ3hCLGtCQUFNLElBQUksU0FBSixDQUFjLGlEQUNBLHlCQURBLEdBQzRCLENBRDVCLENBQXBCLENBRHdCO1dBQTFCO0FBSUEsYUFBRyxJQUFILEVBQVMsTUFBSyxXQUFMLENBQWlCLGNBQWpCLENBQWdDLENBQWhDLEVBQW1DLENBQW5DLENBQVQsRUFORTtTQUFKLENBUUEsT0FBTyxDQUFQLEVBQVU7QUFBRSxhQUFHLENBQUgsRUFBRjtTQUFWLENBVHVCO09BQWQ7UUFOSztHQUFwQjs7ZUFiSTs7Ozs7Ozs7Ozs7OzttQ0EwQ21CLE1BQU0sT0FBTzs7O0FBR2xDLFVBQUksQ0FBQyxLQUFELElBQVUsT0FBTyxLQUFQLElBQWdCLFFBQWhCLEVBQTBCO0FBQ3RDLGNBQU0sSUFBSSxTQUFKLENBQWMsMENBQWQsQ0FBTixDQURzQztPQUF4Qzs7O0FBSGtDLFVBUTlCLE9BQU8sR0FBRyxNQUFILENBQVUsSUFBVixDQUFQOzs7QUFSOEIsYUFXM0IsRUFBRSxHQUFGLENBQU0sSUFBTixFQUFZLFVBQVUsSUFBVixFQUFnQjs7O0FBR2pDLFlBQUksZ0JBQWdCLE1BQWhCLEVBQXdCO0FBQzFCLGlCQUFPLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBUCxDQUQwQjtTQUE1QixDQUhpQzs7QUFPakMsZUFBTztBQUNMLGlCQUFPLEtBQVA7QUFDQSxvQkFBVSxJQUFWO0FBRkssU0FBUCxDQVBpQztPQUFoQixDQUFuQixDQVhrQzs7OztTQTFDaEM7RUFBcUIsT0FBTyxTQUFQOztBQWtFMUI7O0FBRUQsT0FBTyxPQUFQLEdBQWlCLFlBQWpCIiwiZmlsZSI6IkZvcm1hdFN0cmVhbS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbnZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG5cbmNsYXNzIEZvcm1hdFN0cmVhbSBleHRlbmRzIHN0cmVhbS5UcmFuc2Zvcm0ge1xuXG4gIC8qKlxuICAgKiBGb3JtYXRTdHJlYW0gd2lsbCBmb3JtYXQgZGF0YSB0byBiZSBjb25zdW1lZCBieSB0aGUgbm9kZS1rYWZrYVxuICAgKiBsaWJyYXJ5LiBJdCBjYW4gYmUgY3JlYXRlZCB0byBlaXRoZXIgZm9ybWF0IGV2ZXJ5IHBpZWNlIG9mIGRhdGFcbiAgICogaXQgcmVjaWV2ZXMgYXMgdGhlIHRvcGljIGl0IGlzIGdpdmVuLCBvciBpdCBjYW4gYmUgcGFzc2VkIGEgdG9waWNcbiAgICogdHJhbnNmb3JtYXRpb24gZnVuY3Rpb24gdGhhdCBpcyBjYWxsZWQgd2l0aCBlYWNoIGluZGl2aWR1YWwgcGllY2Ugb2ZcbiAgICogZGF0YSBhbmQgaXMgZXhwZWN0ZWQgdG8gcmV0dXJuIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSB0b3BpYy5cbiAgICogQHBhcmFtIHtTdHJpbmd8RnVuY3Rpb259IHRvcGljIHRoZSBzdHJpbmcgb3IgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb25cbiAgICogdGhhdCByZXR1cm5zIHRoZSBkZXNpcmVkIHRvcGljLlxuICAgKiBAdGhyb3dzIHtUeXBlRXJyb3J9IGlmIHRvcGljIGZhaWxzIHRvIHJldHVybiBhIHN0cmluZy5cbiAgICogQHJldHVybnMge1N0cmVhbX1cbiAgICovXG4gIGNvbnN0cnVjdG9yICh0b3BpYykge1xuICAgIGlmICghdG9waWMpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRm9ybWF0U3RyZWFtIHJlcXVpcmVzIGEgdG9waWMgdG8gZm9ybWF0IScpXG4gICAgfVxuICAgIHN1cGVyKHtcbiAgICAgIG9iamVjdE1vZGU6IHRydWUsXG4gICAgICB0cmFuc2Zvcm06IChkLCByLCBjYikgPT4ge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHZhciB0ID0gdHlwZW9mIHRvcGljID09ICdmdW5jdGlvbicgPyB0b3BpYyhkKSA6IHRvcGljO1xuICAgICAgICAgIGlmICh0eXBlb2YgdCAhPSAnc3RyaW5nJykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcigndG9waWMgdHJhbnNmb3JtYXRpb24gZnVuY3Rpb24gZGlkIG5vdCByZXR1cm4nICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2Egc3RyaW5nLiBJdCByZXR1cm5lZDogJyArIHQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjYihudWxsLCB0aGlzLmNvbnN0cnVjdG9yLl9mb3JtYXRQYXlsb2FkKGQsIHQpKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZSkgeyBjYihlKSB9O1xuICAgICAgfVxuICAgIH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBGb3JtYXRzIGEgcGllY2Ugb2YgZGF0YSwgZWl0aGVyIGFuIGFycmF5IG9yIHNpbmdsZSBvYmplY3QsIGludG8gdGhlIGV4cGVjdGVkXG4gICAqIGZvcm1hdCByZXF1aXJlZCBieSBLYWZrYSBwcm9kdWNlcnMuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIHdoYXRldmVyIGpzIG9iamVjdCB5b3Ugd2FudCBzdHJpbmdpZmllZCBhbmQgc2VudCBpbiB0aGUgbWVzc2FnZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IHRvcGljIHRoZSBLYWZrYSB0b3BpYyB0aGUgbWVzc2FnZSBzaG91bGQgZ28gb3V0IG9uLlxuICAgKiBAcmV0dXJucyB7T2JqZWN0fSB3aXRoICd0b3BpYycgYW5kICdtZXNzYWdlcycga2V5cy5cbiAgICogQHRocm93cyB7VHlwZUVycm9yfSBpZiBub3QgZ2l2ZW4gYSBzdHJpbmcgYXMgYSB0b3BpY1xuICAgKi9cbiAgc3RhdGljIF9mb3JtYXRQYXlsb2FkIChkYXRhLCB0b3BpYykge1xuXG4gICAgLy8gVG9waWMgaXMgcmVxdWlyZWQgYW5kIG11c3QgYmUgYSBzdHJpbmchXG4gICAgaWYgKCF0b3BpYyB8fCB0eXBlb2YgdG9waWMgIT0gJ3N0cmluZycpIHtcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ2Zvcm1hdERhdGEgcmVxdWlyZXMgYSB0b3BpYywgbm9uZSBnaXZlbiEnKVxuICAgIH1cblxuICAgIC8vIGNvZXJjZSBkYXRhIGludG8gYXJyYXkgaWYgaXQgaXNuJ3QgYWxyZWFkeVxuICAgIHZhciBkYXRhID0gW10uY29uY2F0KGRhdGEpO1xuXG4gICAgLy8gRm9ybWF0IHRoZSBkYXRhIGFzIHdlIHdhbnQgaXQsIGFjY29yZGluZyB0byBub2RlLWthZmthIEFQSVxuICAgIHJldHVybiBfLm1hcChkYXRhLCBmdW5jdGlvbiAoaXRlbSkge1xuXG4gICAgICAvLyBDb2VyY2UgYWxsIG91ciBqcyBvYmplY3QgdHlwZXMgaW50byBzdHJpbmdzIGZvciBzZXJpYWxpemluZ1xuICAgICAgaWYgKGl0ZW0gaW5zdGFuY2VvZiBPYmplY3QpIHtcbiAgICAgICAgaXRlbSA9IEpTT04uc3RyaW5naWZ5KGl0ZW0pXG4gICAgICB9O1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICB0b3BpYzogdG9waWMsXG4gICAgICAgIG1lc3NhZ2VzOiBpdGVtIC8vIGlzIHRoaXMgdGhlIGJlc3Qgd2F5IHRvIGNvbW11bmljYXRlIGl0P1xuICAgICAgfTtcbiAgICB9KTtcbiAgfTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRm9ybWF0U3RyZWFtXG4iXX0=
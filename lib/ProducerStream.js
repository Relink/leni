'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');
var stream = require('stream');
var eddies = require('@relinklabs/eddies');
var EventEmitter = require('events').EventEmitter;

var ProducerStream = function () {

  /**
   * ProducerStream returns a stream that produces whatever the hell it wants
   * @param {} producer
   * @param {Object} options
   * @param {Boolean} [options.duplex = false] indicates whether you intend to
   * use this as a writable stream (not piping into anything else) or a
   * duplex stream (piping results from the kafka publishing into something else).
   * @returns {}
   */

  function ProducerStream(producer) {
    var _this = this;

    var _ref = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var _ref$duplex = _ref.duplex;
    var duplex = _ref$duplex === undefined ? false : _ref$duplex;

    _classCallCheck(this, ProducerStream);

    var _producer = producer;
    var producerStream = eddies.create({ number: 10, errorCount: 10 }, function (msg) {
      return _this.constructor._sendMessage(_producer, msg).then(function (data) {
        return { message: data };
      });
    });
    if (!duplex) {
      producerStream.pipe(new stream.Writable({
        objectMode: true,
        write: function write(d, e, c) {
          return c();
        }
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


  _createClass(ProducerStream, null, [{
    key: '_sendMessage',
    value: function _sendMessage(producer, data) {

      // producer must be a instance of the node-kafka Producer! Otherwise, reject.
      if (typeof producer.sendAsync != 'function') {
        return Promise.reject(new TypeError('sendMessage requires a kafka producer, and the ' + 'object you passed does not look look like one!'));
      }

      // If there is no data, reject!
      if (!data) {
        return Promise.reject(new TypeError('sendMessage requires something to send!!'));
      }
      return producer.sendAsync(data);
    }
  }]);

  return ProducerStream;
}();

module.exports = ProducerStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Qcm9kdWNlclN0cmVhbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFJLElBQUksUUFBUSxRQUFSLENBQUo7QUFDSixJQUFJLFNBQVMsUUFBUSxRQUFSLENBQVQ7QUFDSixJQUFJLFNBQVMsUUFBUSxvQkFBUixDQUFUO0FBQ0osSUFBSSxlQUFlLFFBQVEsUUFBUixFQUFrQixZQUFsQjs7SUFFYjs7Ozs7Ozs7Ozs7O0FBV0osV0FYSSxjQVdKLENBQWEsUUFBYixFQUE4Qzs7O3FFQUFKLGtCQUFJOzsyQkFBdEIsT0FBc0I7UUFBdEIscUNBQVMsb0JBQWE7OzBCQVgxQyxnQkFXMEM7O0FBQzVDLFFBQUksWUFBWSxRQUFaLENBRHdDO0FBRTVDLFFBQUksaUJBQWlCLE9BQU8sTUFBUCxDQUFjLEVBQUMsUUFBUSxFQUFSLEVBQVksWUFBWSxFQUFaLEVBQTNCLEVBQTRDLGVBQU87QUFDdEUsYUFBTyxNQUFLLFdBQUwsQ0FBaUIsWUFBakIsQ0FBOEIsU0FBOUIsRUFBeUMsR0FBekMsRUFDSixJQURJLENBQ0M7ZUFBUyxFQUFFLFNBQVMsSUFBVDtPQUFYLENBRFIsQ0FEc0U7S0FBUCxDQUE3RCxDQUZ3QztBQU01QyxRQUFJLENBQUMsTUFBRCxFQUFTO0FBQ1gscUJBQWUsSUFBZixDQUFvQixJQUFJLE9BQU8sUUFBUCxDQUFnQjtBQUN0QyxvQkFBWSxJQUFaO0FBQ0EsZUFBTyxlQUFDLENBQUQsRUFBRyxDQUFILEVBQUssQ0FBTDtpQkFBVztTQUFYO09BRlcsQ0FBcEIsRUFEVztLQUFiO0FBTUEsV0FBTyxjQUFQLENBWjRDO0dBQTlDOzs7Ozs7Ozs7Ozs7O2VBWEk7O2lDQW1DaUIsVUFBVSxNQUFNOzs7QUFHbkMsVUFBSSxPQUFPLFNBQVMsU0FBVCxJQUFzQixVQUE3QixFQUF5QztBQUMzQyxlQUFPLFFBQVEsTUFBUixDQUFlLElBQUksU0FBSixDQUFjLG9EQUNBLGdEQURBLENBQTdCLENBQVAsQ0FEMkM7T0FBN0M7OztBQUhtQyxVQVMvQixDQUFDLElBQUQsRUFBTztBQUNULGVBQU8sUUFBUSxNQUFSLENBQWUsSUFBSSxTQUFKLENBQWMsMENBQWQsQ0FBZixDQUFQLENBRFM7T0FBWDtBQUdBLGFBQU8sU0FBUyxTQUFULENBQW1CLElBQW5CLENBQVAsQ0FabUM7Ozs7U0FuQ2pDOzs7QUFvRE4sT0FBTyxPQUFQLEdBQWlCLGNBQWpCIiwiZmlsZSI6IlByb2R1Y2VyU3RyZWFtLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIF8gPSByZXF1aXJlKCdsb2Rhc2gnKTtcbnZhciBzdHJlYW0gPSByZXF1aXJlKCdzdHJlYW0nKTtcbnZhciBlZGRpZXMgPSByZXF1aXJlKCdAcmVsaW5rbGFicy9lZGRpZXMnKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG5cbmNsYXNzIFByb2R1Y2VyU3RyZWFtIHtcblxuICAvKipcbiAgICogUHJvZHVjZXJTdHJlYW0gcmV0dXJucyBhIHN0cmVhbSB0aGF0IHByb2R1Y2VzIHdoYXRldmVyIHRoZSBoZWxsIGl0IHdhbnRzXG4gICAqIEBwYXJhbSB7fSBwcm9kdWNlclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgKiBAcGFyYW0ge0Jvb2xlYW59IFtvcHRpb25zLmR1cGxleCA9IGZhbHNlXSBpbmRpY2F0ZXMgd2hldGhlciB5b3UgaW50ZW5kIHRvXG4gICAqIHVzZSB0aGlzIGFzIGEgd3JpdGFibGUgc3RyZWFtIChub3QgcGlwaW5nIGludG8gYW55dGhpbmcgZWxzZSkgb3IgYVxuICAgKiBkdXBsZXggc3RyZWFtIChwaXBpbmcgcmVzdWx0cyBmcm9tIHRoZSBrYWZrYSBwdWJsaXNoaW5nIGludG8gc29tZXRoaW5nIGVsc2UpLlxuICAgKiBAcmV0dXJucyB7fVxuICAgKi9cbiAgY29uc3RydWN0b3IgKHByb2R1Y2VyLCB7ZHVwbGV4ID0gZmFsc2V9ID0ge30pIHtcbiAgICB2YXIgX3Byb2R1Y2VyID0gcHJvZHVjZXI7XG4gICAgdmFyIHByb2R1Y2VyU3RyZWFtID0gZWRkaWVzLmNyZWF0ZSh7bnVtYmVyOiAxMCwgZXJyb3JDb3VudDogMTB9LCBtc2cgPT4ge1xuICAgICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuX3NlbmRNZXNzYWdlKF9wcm9kdWNlciwgbXNnKVxuICAgICAgICAudGhlbihkYXRhID0+ICh7IG1lc3NhZ2U6IGRhdGEgfSkpXG4gICAgfSlcbiAgICBpZiAoIWR1cGxleCkge1xuICAgICAgcHJvZHVjZXJTdHJlYW0ucGlwZShuZXcgc3RyZWFtLldyaXRhYmxlKHtcbiAgICAgICAgb2JqZWN0TW9kZTogdHJ1ZSxcbiAgICAgICAgd3JpdGU6IChkLGUsYykgPT4gYygpXG4gICAgICB9KSk7XG4gICAgfVxuICAgIHJldHVybiBwcm9kdWNlclN0cmVhbTtcbiAgfVxuXG4gIC8qKlxuICAgKiBzZW5kTWVzc2FnZSBwdXRzIG1lc3NhZ2VzIG9udG8gdGhlIEthZmthIHF1ZXVlIVxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJvZHVjZXIgYSBub2RlLWthZmthIHByb2R1Y2VyLCBjcmVhdGVkIGJ5IGxlbmkuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIGEgcG9qbyB0aGF0IGlzIHRoZSBtZXNzYWdlIHRvIGJlIHNlbnQuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0b3BpYyB0aGUgS2Fma2EgdG9waWMgdGhhdCB0aGUgbWVzc2FnZSBzaG91bGQgYmUgc2VudCBvbi5cbiAgICogQHJldHVybnMge1Byb21pc2V9IHRoYXQgcmVzb2x2ZXMgb3IgcmVqZWN0cyBiYXNlZCBvbiBjYWxsYmFjayBmcm9tXG4gICAqIG5vZGUta2Fma2EgcHJvZHVjZXIuXG4gICAqL1xuICBzdGF0aWMgX3NlbmRNZXNzYWdlIChwcm9kdWNlciwgZGF0YSkge1xuXG4gICAgLy8gcHJvZHVjZXIgbXVzdCBiZSBhIGluc3RhbmNlIG9mIHRoZSBub2RlLWthZmthIFByb2R1Y2VyISBPdGhlcndpc2UsIHJlamVjdC5cbiAgICBpZiAodHlwZW9mIHByb2R1Y2VyLnNlbmRBc3luYyAhPSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignc2VuZE1lc3NhZ2UgcmVxdWlyZXMgYSBrYWZrYSBwcm9kdWNlciwgYW5kIHRoZSAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvYmplY3QgeW91IHBhc3NlZCBkb2VzIG5vdCBsb29rIGxvb2sgbGlrZSBvbmUhJykpO1xuICAgIH1cblxuICAgIC8vIElmIHRoZXJlIGlzIG5vIGRhdGEsIHJlamVjdCFcbiAgICBpZiAoIWRhdGEpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChuZXcgVHlwZUVycm9yKCdzZW5kTWVzc2FnZSByZXF1aXJlcyBzb21ldGhpbmcgdG8gc2VuZCEhJykpO1xuICAgIH1cbiAgICByZXR1cm4gcHJvZHVjZXIuc2VuZEFzeW5jKGRhdGEpO1xuICB9O1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gUHJvZHVjZXJTdHJlYW07XG4iXX0=
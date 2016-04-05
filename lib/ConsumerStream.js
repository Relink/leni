'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _ = require('lodash');
var util = require('util');
var Readable = require('stream').Readable;

/**
 * ConsumerStream extends Stream.Readable, creates a stream out of node-kafka
 * consumer that will
 * @param {EventEmitter} consumer node-kafka consumer to wrap in stream.
 * @param {Object} options standard node stream.Readable options.
 */

var ConsumerStream = function (_Readable) {
  _inherits(ConsumerStream, _Readable);

  function ConsumerStream(consumer, options) {
    _classCallCheck(this, ConsumerStream);

    options = _.merge({ objectMode: true }, options);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(ConsumerStream).call(this, options));

    _this._consumer = consumer;

    _this._consumer.on('message', function (msg) {

      // if push() returns false, then we need to stop reading from source
      if (!_this.push(msg)) {

        // if message push failed, set the consumer offset back to the failed
        // message so that it is not lost!
        _this._consumer.pause();
      };
    });

    // NOTE: We could listen to the 'done' event, but the consumer sends this
    // event over and over again if it's at the end of its queue, causing havoc.
    // Right now I can't see why we need to listen to the done event anyways?
    _this._consumer.on('error', function (err) {
      return _this.emit('error', err);
    });

    // node-kafka consumers do not necessarily begin paused, so we force it here.
    _this._consumer.pause();
    return _this;
  }

  _createClass(ConsumerStream, [{
    key: '_read',
    value: function _read() {

      // doesn't seem to cause any problems to call resume continually? But should
      // maybe only be called if paused? We can assume MOST of the time, if the queue
      // is reasonably full, we will be resuming/pausing between every read event?
      this._consumer.resume();
    }
  }]);

  return ConsumerStream;
}(Readable);

module.exports = ConsumerStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db25zdW1lclN0cmVhbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSSxJQUFJLFFBQVEsUUFBUixDQUFKO0FBQ0osSUFBSSxPQUFPLFFBQVEsTUFBUixDQUFQO0FBQ0osSUFBSSxXQUFXLFFBQVEsUUFBUixFQUFrQixRQUFsQjs7Ozs7Ozs7O0lBUVQ7OztBQUVKLFdBRkksY0FFSixDQUFhLFFBQWIsRUFBdUIsT0FBdkIsRUFBZ0M7MEJBRjVCLGdCQUU0Qjs7QUFDOUIsY0FBVSxFQUFFLEtBQUYsQ0FBUSxFQUFFLFlBQVksSUFBWixFQUFWLEVBQThCLE9BQTlCLENBQVYsQ0FEOEI7O3VFQUY1QiwyQkFJSSxVQUZ3Qjs7QUFHOUIsVUFBSyxTQUFMLEdBQWlCLFFBQWpCLENBSDhCOztBQUs5QixVQUFLLFNBQUwsQ0FBZSxFQUFmLENBQWtCLFNBQWxCLEVBQTZCLGVBQU87OztBQUdsQyxVQUFJLENBQUMsTUFBSyxJQUFMLENBQVUsR0FBVixDQUFELEVBQWlCOzs7O0FBSW5CLGNBQUssU0FBTCxDQUFlLEtBQWYsR0FKbUI7T0FBckIsQ0FIa0M7S0FBUCxDQUE3Qjs7Ozs7QUFMOEIsU0FtQjlCLENBQUssU0FBTCxDQUFlLEVBQWYsQ0FBa0IsT0FBbEIsRUFBMkI7YUFBTyxNQUFLLElBQUwsQ0FBVSxPQUFWLEVBQW1CLEdBQW5CO0tBQVAsQ0FBM0I7OztBQW5COEIsU0FzQjlCLENBQUssU0FBTCxDQUFlLEtBQWYsR0F0QjhCOztHQUFoQzs7ZUFGSTs7NEJBMkJLOzs7OztBQUtQLFdBQUssU0FBTCxDQUFlLE1BQWYsR0FMTzs7OztTQTNCTDtFQUF1Qjs7QUFvQzdCLE9BQU8sT0FBUCxHQUFpQixjQUFqQiIsImZpbGUiOiJDb25zdW1lclN0cmVhbS5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBfID0gcmVxdWlyZSgnbG9kYXNoJyk7XG52YXIgdXRpbCA9IHJlcXVpcmUoJ3V0aWwnKTtcbnZhciBSZWFkYWJsZSA9IHJlcXVpcmUoJ3N0cmVhbScpLlJlYWRhYmxlO1xuXG4vKipcbiAqIENvbnN1bWVyU3RyZWFtIGV4dGVuZHMgU3RyZWFtLlJlYWRhYmxlLCBjcmVhdGVzIGEgc3RyZWFtIG91dCBvZiBub2RlLWthZmthXG4gKiBjb25zdW1lciB0aGF0IHdpbGxcbiAqIEBwYXJhbSB7RXZlbnRFbWl0dGVyfSBjb25zdW1lciBub2RlLWthZmthIGNvbnN1bWVyIHRvIHdyYXAgaW4gc3RyZWFtLlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgc3RhbmRhcmQgbm9kZSBzdHJlYW0uUmVhZGFibGUgb3B0aW9ucy5cbiAqL1xuY2xhc3MgQ29uc3VtZXJTdHJlYW0gZXh0ZW5kcyBSZWFkYWJsZSB7XG5cbiAgY29uc3RydWN0b3IgKGNvbnN1bWVyLCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IF8ubWVyZ2UoeyBvYmplY3RNb2RlOiB0cnVlIH0sIG9wdGlvbnMpO1xuICAgIHN1cGVyKG9wdGlvbnMpO1xuICAgIHRoaXMuX2NvbnN1bWVyID0gY29uc3VtZXI7XG5cbiAgICB0aGlzLl9jb25zdW1lci5vbignbWVzc2FnZScsIG1zZyA9PiB7XG5cbiAgICAgIC8vIGlmIHB1c2goKSByZXR1cm5zIGZhbHNlLCB0aGVuIHdlIG5lZWQgdG8gc3RvcCByZWFkaW5nIGZyb20gc291cmNlXG4gICAgICBpZiAoIXRoaXMucHVzaChtc2cpKSB7XG5cbiAgICAgICAgLy8gaWYgbWVzc2FnZSBwdXNoIGZhaWxlZCwgc2V0IHRoZSBjb25zdW1lciBvZmZzZXQgYmFjayB0byB0aGUgZmFpbGVkXG4gICAgICAgIC8vIG1lc3NhZ2Ugc28gdGhhdCBpdCBpcyBub3QgbG9zdCFcbiAgICAgICAgdGhpcy5fY29uc3VtZXIucGF1c2UoKTtcbiAgICAgIH07XG4gICAgfSk7XG5cbiAgICAvLyBOT1RFOiBXZSBjb3VsZCBsaXN0ZW4gdG8gdGhlICdkb25lJyBldmVudCwgYnV0IHRoZSBjb25zdW1lciBzZW5kcyB0aGlzXG4gICAgLy8gZXZlbnQgb3ZlciBhbmQgb3ZlciBhZ2FpbiBpZiBpdCdzIGF0IHRoZSBlbmQgb2YgaXRzIHF1ZXVlLCBjYXVzaW5nIGhhdm9jLlxuICAgIC8vIFJpZ2h0IG5vdyBJIGNhbid0IHNlZSB3aHkgd2UgbmVlZCB0byBsaXN0ZW4gdG8gdGhlIGRvbmUgZXZlbnQgYW55d2F5cz9cbiAgICB0aGlzLl9jb25zdW1lci5vbignZXJyb3InLCBlcnIgPT4gdGhpcy5lbWl0KCdlcnJvcicsIGVycikpO1xuXG4gICAgLy8gbm9kZS1rYWZrYSBjb25zdW1lcnMgZG8gbm90IG5lY2Vzc2FyaWx5IGJlZ2luIHBhdXNlZCwgc28gd2UgZm9yY2UgaXQgaGVyZS5cbiAgICB0aGlzLl9jb25zdW1lci5wYXVzZSgpO1xuICB9XG5cbiAgX3JlYWQgKCkge1xuXG4gICAgLy8gZG9lc24ndCBzZWVtIHRvIGNhdXNlIGFueSBwcm9ibGVtcyB0byBjYWxsIHJlc3VtZSBjb250aW51YWxseT8gQnV0IHNob3VsZFxuICAgIC8vIG1heWJlIG9ubHkgYmUgY2FsbGVkIGlmIHBhdXNlZD8gV2UgY2FuIGFzc3VtZSBNT1NUIG9mIHRoZSB0aW1lLCBpZiB0aGUgcXVldWVcbiAgICAvLyBpcyByZWFzb25hYmx5IGZ1bGwsIHdlIHdpbGwgYmUgcmVzdW1pbmcvcGF1c2luZyBiZXR3ZWVuIGV2ZXJ5IHJlYWQgZXZlbnQ/XG4gICAgdGhpcy5fY29uc3VtZXIucmVzdW1lKCk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25zdW1lclN0cmVhbTtcbiJdfQ==
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
      if (this._consumer.paused) {
        this._consumer.resume();
      }
    }
  }]);

  return ConsumerStream;
}(Readable);

module.exports = ConsumerStream;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db25zdW1lclN0cmVhbS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEsSUFBSSxJQUFJLFFBQVEsUUFBUixDQUFKO0FBQ0osSUFBSSxPQUFPLFFBQVEsTUFBUixDQUFQO0FBQ0osSUFBSSxXQUFXLFFBQVEsUUFBUixFQUFrQixRQUFsQjs7Ozs7Ozs7O0lBUVQ7OztBQUVKLFdBRkksY0FFSixDQUFhLFFBQWIsRUFBdUIsT0FBdkIsRUFBZ0M7MEJBRjVCLGdCQUU0Qjs7QUFDOUIsY0FBVSxFQUFFLEtBQUYsQ0FBUSxFQUFFLFlBQVksSUFBWixFQUFWLEVBQThCLE9BQTlCLENBQVYsQ0FEOEI7O3VFQUY1QiwyQkFJSSxVQUZ3Qjs7QUFHOUIsVUFBSyxTQUFMLEdBQWlCLFFBQWpCLENBSDhCOztBQUs5QixVQUFLLFNBQUwsQ0FBZSxFQUFmLENBQWtCLFNBQWxCLEVBQTZCLGVBQU87OztBQUdsQyxVQUFJLENBQUMsTUFBSyxJQUFMLENBQVUsR0FBVixDQUFELEVBQWlCOzs7O0FBSW5CLGNBQUssU0FBTCxDQUFlLEtBQWYsR0FKbUI7T0FBckIsQ0FIa0M7S0FBUCxDQUE3Qjs7Ozs7QUFMOEIsU0FtQjlCLENBQUssU0FBTCxDQUFlLEVBQWYsQ0FBa0IsT0FBbEIsRUFBMkI7YUFBTyxNQUFLLElBQUwsQ0FBVSxPQUFWLEVBQW1CLEdBQW5CO0tBQVAsQ0FBM0I7OztBQW5COEIsU0FzQjlCLENBQUssU0FBTCxDQUFlLEtBQWYsR0F0QjhCOztHQUFoQzs7ZUFGSTs7NEJBMkJLO0FBQ1AsVUFBSSxLQUFLLFNBQUwsQ0FBZSxNQUFmLEVBQXVCO0FBQ3pCLGFBQUssU0FBTCxDQUFlLE1BQWYsR0FEeUI7T0FBM0I7Ozs7U0E1QkU7RUFBdUI7O0FBa0M3QixPQUFPLE9BQVAsR0FBaUIsY0FBakIiLCJmaWxlIjoiQ29uc3VtZXJTdHJlYW0uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIHV0aWwgPSByZXF1aXJlKCd1dGlsJyk7XG52YXIgUmVhZGFibGUgPSByZXF1aXJlKCdzdHJlYW0nKS5SZWFkYWJsZTtcblxuLyoqXG4gKiBDb25zdW1lclN0cmVhbSBleHRlbmRzIFN0cmVhbS5SZWFkYWJsZSwgY3JlYXRlcyBhIHN0cmVhbSBvdXQgb2Ygbm9kZS1rYWZrYVxuICogY29uc3VtZXIgdGhhdCB3aWxsXG4gKiBAcGFyYW0ge0V2ZW50RW1pdHRlcn0gY29uc3VtZXIgbm9kZS1rYWZrYSBjb25zdW1lciB0byB3cmFwIGluIHN0cmVhbS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIHN0YW5kYXJkIG5vZGUgc3RyZWFtLlJlYWRhYmxlIG9wdGlvbnMuXG4gKi9cbmNsYXNzIENvbnN1bWVyU3RyZWFtIGV4dGVuZHMgUmVhZGFibGUge1xuXG4gIGNvbnN0cnVjdG9yIChjb25zdW1lciwgb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSBfLm1lcmdlKHsgb2JqZWN0TW9kZTogdHJ1ZSB9LCBvcHRpb25zKTtcbiAgICBzdXBlcihvcHRpb25zKTtcbiAgICB0aGlzLl9jb25zdW1lciA9IGNvbnN1bWVyO1xuXG4gICAgdGhpcy5fY29uc3VtZXIub24oJ21lc3NhZ2UnLCBtc2cgPT4ge1xuXG4gICAgICAvLyBpZiBwdXNoKCkgcmV0dXJucyBmYWxzZSwgdGhlbiB3ZSBuZWVkIHRvIHN0b3AgcmVhZGluZyBmcm9tIHNvdXJjZVxuICAgICAgaWYgKCF0aGlzLnB1c2gobXNnKSkge1xuXG4gICAgICAgIC8vIGlmIG1lc3NhZ2UgcHVzaCBmYWlsZWQsIHNldCB0aGUgY29uc3VtZXIgb2Zmc2V0IGJhY2sgdG8gdGhlIGZhaWxlZFxuICAgICAgICAvLyBtZXNzYWdlIHNvIHRoYXQgaXQgaXMgbm90IGxvc3QhXG4gICAgICAgIHRoaXMuX2NvbnN1bWVyLnBhdXNlKCk7XG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgLy8gTk9URTogV2UgY291bGQgbGlzdGVuIHRvIHRoZSAnZG9uZScgZXZlbnQsIGJ1dCB0aGUgY29uc3VtZXIgc2VuZHMgdGhpc1xuICAgIC8vIGV2ZW50IG92ZXIgYW5kIG92ZXIgYWdhaW4gaWYgaXQncyBhdCB0aGUgZW5kIG9mIGl0cyBxdWV1ZSwgY2F1c2luZyBoYXZvYy5cbiAgICAvLyBSaWdodCBub3cgSSBjYW4ndCBzZWUgd2h5IHdlIG5lZWQgdG8gbGlzdGVuIHRvIHRoZSBkb25lIGV2ZW50IGFueXdheXM/XG4gICAgdGhpcy5fY29uc3VtZXIub24oJ2Vycm9yJywgZXJyID0+IHRoaXMuZW1pdCgnZXJyb3InLCBlcnIpKTtcblxuICAgIC8vIG5vZGUta2Fma2EgY29uc3VtZXJzIGRvIG5vdCBuZWNlc3NhcmlseSBiZWdpbiBwYXVzZWQsIHNvIHdlIGZvcmNlIGl0IGhlcmUuXG4gICAgdGhpcy5fY29uc3VtZXIucGF1c2UoKTtcbiAgfVxuXG4gIF9yZWFkICgpIHtcbiAgICBpZiAodGhpcy5fY29uc3VtZXIucGF1c2VkKSB7XG4gICAgICB0aGlzLl9jb25zdW1lci5yZXN1bWUoKTtcbiAgICB9XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBDb25zdW1lclN0cmVhbTtcbiJdfQ==
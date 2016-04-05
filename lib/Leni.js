'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConsumerStream = require('./ConsumerStream');
var ProducerStream = require('./ProducerStream');
var FormatStream = require('./FormatStream');

/*
 * This is what you get when you initialize the library.
 */

var Leni = function () {
  function Leni(client, consumer, producer) {
    _classCallCheck(this, Leni);

    this.client = client;
    this.consumer = consumer;
    this.producer = producer;
  }

  _createClass(Leni, [{
    key: 'consumerStream',
    value: function consumerStream(options) {
      return this.constructor.createStream(ConsumerStream, this.consumer, options);
    }
  }, {
    key: 'producerStream',
    value: function producerStream(options) {
      return this.constructor.createStream(ProducerStream, this.producer, options);
    }
  }, {
    key: 'formatStream',
    value: function formatStream(topic) {
      return new FormatStream(topic);
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(msg) {
      return ProducerStream._sendMessage(this.producer, msg);
    }
  }, {
    key: 'close',
    value: function close() {
      return this.client.closeAsync();
    }
  }], [{
    key: 'createStream',
    value: function createStream(stream, source, options) {
      if (!stream) {
        throw new Error('you need to properly setup a ' + source + ' to get a stream!');
      }
      return new stream(source, options);
    }
  }]);

  return Leni;
}();

;

module.exports = Leni;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9MZW5pLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBakI7QUFDSixJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQWpCO0FBQ0osSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBZjs7Ozs7O0lBS0U7QUFDSixXQURJLElBQ0osQ0FBWSxNQUFaLEVBQW9CLFFBQXBCLEVBQThCLFFBQTlCLEVBQXdDOzBCQURwQyxNQUNvQzs7QUFDdEMsU0FBSyxNQUFMLEdBQWMsTUFBZCxDQURzQztBQUV0QyxTQUFLLFFBQUwsR0FBZ0IsUUFBaEIsQ0FGc0M7QUFHdEMsU0FBSyxRQUFMLEdBQWdCLFFBQWhCLENBSHNDO0dBQXhDOztlQURJOzttQ0FPVyxTQUFTO0FBQ3RCLGFBQU8sS0FBSyxXQUFMLENBQWlCLFlBQWpCLENBQThCLGNBQTlCLEVBQThDLEtBQUssUUFBTCxFQUFlLE9BQTdELENBQVAsQ0FEc0I7Ozs7bUNBSVQsU0FBUztBQUN0QixhQUFPLEtBQUssV0FBTCxDQUFpQixZQUFqQixDQUE4QixjQUE5QixFQUE4QyxLQUFLLFFBQUwsRUFBZSxPQUE3RCxDQUFQLENBRHNCOzs7O2lDQUlYLE9BQU87QUFDbEIsYUFBTyxJQUFJLFlBQUosQ0FBaUIsS0FBakIsQ0FBUCxDQURrQjs7OztnQ0FJUixLQUFLO0FBQ2YsYUFBTyxlQUFlLFlBQWYsQ0FBNEIsS0FBSyxRQUFMLEVBQWUsR0FBM0MsQ0FBUCxDQURlOzs7OzRCQUlUO0FBQ04sYUFBTyxLQUFLLE1BQUwsQ0FBWSxVQUFaLEVBQVAsQ0FETTs7OztpQ0FJWSxRQUFRLFFBQVEsU0FBUTtBQUMxQyxVQUFJLENBQUMsTUFBRCxFQUFRO0FBQ1YsY0FBTSxJQUFJLEtBQUosQ0FBVSxrQ0FBa0MsTUFBbEMsR0FBMkMsbUJBQTNDLENBQWhCLENBRFU7T0FBWjtBQUdBLGFBQU8sSUFBSSxNQUFKLENBQVcsTUFBWCxFQUFtQixPQUFuQixDQUFQLENBSjBDOzs7O1NBM0J4Qzs7O0FBaUNMOztBQUVELE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJMZW5pLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIENvbnN1bWVyU3RyZWFtID0gcmVxdWlyZSgnLi9Db25zdW1lclN0cmVhbScpO1xudmFyIFByb2R1Y2VyU3RyZWFtID0gcmVxdWlyZSgnLi9Qcm9kdWNlclN0cmVhbScpO1xudmFyIEZvcm1hdFN0cmVhbSA9IHJlcXVpcmUoJy4vRm9ybWF0U3RyZWFtJyk7XG5cbi8qXG4gKiBUaGlzIGlzIHdoYXQgeW91IGdldCB3aGVuIHlvdSBpbml0aWFsaXplIHRoZSBsaWJyYXJ5LlxuICovXG5jbGFzcyBMZW5pIHtcbiAgY29uc3RydWN0b3IoY2xpZW50LCBjb25zdW1lciwgcHJvZHVjZXIpIHtcbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLmNvbnN1bWVyID0gY29uc3VtZXI7XG4gICAgdGhpcy5wcm9kdWNlciA9IHByb2R1Y2VyO1xuICB9O1xuXG4gIGNvbnN1bWVyU3RyZWFtKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5jcmVhdGVTdHJlYW0oQ29uc3VtZXJTdHJlYW0sIHRoaXMuY29uc3VtZXIsIG9wdGlvbnMpO1xuICB9O1xuXG4gIHByb2R1Y2VyU3RyZWFtKG9wdGlvbnMpIHtcbiAgICByZXR1cm4gdGhpcy5jb25zdHJ1Y3Rvci5jcmVhdGVTdHJlYW0oUHJvZHVjZXJTdHJlYW0sIHRoaXMucHJvZHVjZXIsIG9wdGlvbnMpO1xuICB9O1xuXG4gIGZvcm1hdFN0cmVhbSh0b3BpYykge1xuICAgIHJldHVybiBuZXcgRm9ybWF0U3RyZWFtKHRvcGljKTtcbiAgfTtcblxuICBzZW5kTWVzc2FnZShtc2cpIHtcbiAgICByZXR1cm4gUHJvZHVjZXJTdHJlYW0uX3NlbmRNZXNzYWdlKHRoaXMucHJvZHVjZXIsIG1zZyk7XG4gIH07XG5cbiAgY2xvc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuY2xpZW50LmNsb3NlQXN5bmMoKTtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVTdHJlYW0oc3RyZWFtLCBzb3VyY2UsIG9wdGlvbnMpe1xuICAgIGlmICghc3RyZWFtKXtcbiAgICAgIHRocm93IG5ldyBFcnJvcigneW91IG5lZWQgdG8gcHJvcGVybHkgc2V0dXAgYSAnICsgc291cmNlICsgJyB0byBnZXQgYSBzdHJlYW0hJyk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgc3RyZWFtKHNvdXJjZSwgb3B0aW9ucyk7XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gTGVuaTtcbiJdfQ==
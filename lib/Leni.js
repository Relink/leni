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
    var _this = this;

    _classCallCheck(this, Leni);

    this.client = client;
    this.consumer = consumer;
    this.producer = producer;

    // put this somewhere else?
    process.on('SIGTERM', function () {
      _this.consumer.close(true, function () {
        return process.exit(0);
      });
    });
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
    key: 'formatMessage',
    value: function formatMessage(msg, topic) {
      return FormatStream._formatPayload(msg, topic);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9MZW5pLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUksaUJBQWlCLFFBQVEsa0JBQVIsQ0FBakI7QUFDSixJQUFJLGlCQUFpQixRQUFRLGtCQUFSLENBQWpCO0FBQ0osSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBZjs7Ozs7O0lBS0U7QUFDSixXQURJLElBQ0osQ0FBWSxNQUFaLEVBQW9CLFFBQXBCLEVBQThCLFFBQTlCLEVBQXdDOzs7MEJBRHBDLE1BQ29DOztBQUN0QyxTQUFLLE1BQUwsR0FBYyxNQUFkLENBRHNDO0FBRXRDLFNBQUssUUFBTCxHQUFnQixRQUFoQixDQUZzQztBQUd0QyxTQUFLLFFBQUwsR0FBZ0IsUUFBaEI7OztBQUhzQyxXQU10QyxDQUFRLEVBQVIsQ0FBVyxTQUFYLEVBQXNCLFlBQUs7QUFDekIsWUFBSyxRQUFMLENBQWMsS0FBZCxDQUFvQixJQUFwQixFQUEwQjtlQUFNLFFBQVEsSUFBUixDQUFhLENBQWI7T0FBTixDQUExQixDQUR5QjtLQUFMLENBQXRCLENBTnNDO0dBQXhDOztlQURJOzttQ0FZVyxTQUFTO0FBQ3RCLGFBQU8sS0FBSyxXQUFMLENBQWlCLFlBQWpCLENBQThCLGNBQTlCLEVBQThDLEtBQUssUUFBTCxFQUFlLE9BQTdELENBQVAsQ0FEc0I7Ozs7bUNBSVQsU0FBUztBQUN0QixhQUFPLEtBQUssV0FBTCxDQUFpQixZQUFqQixDQUE4QixjQUE5QixFQUE4QyxLQUFLLFFBQUwsRUFBZSxPQUE3RCxDQUFQLENBRHNCOzs7O2lDQUlYLE9BQU87QUFDbEIsYUFBTyxJQUFJLFlBQUosQ0FBaUIsS0FBakIsQ0FBUCxDQURrQjs7OztrQ0FJTixLQUFLLE9BQU87QUFDeEIsYUFBTyxhQUFhLGNBQWIsQ0FBNEIsR0FBNUIsRUFBaUMsS0FBakMsQ0FBUCxDQUR3Qjs7OztnQ0FJZCxLQUFLO0FBQ2YsYUFBTyxlQUFlLFlBQWYsQ0FBNEIsS0FBSyxRQUFMLEVBQWUsR0FBM0MsQ0FBUCxDQURlOzs7OzRCQUlUO0FBQ04sYUFBTyxLQUFLLE1BQUwsQ0FBWSxVQUFaLEVBQVAsQ0FETTs7OztpQ0FJWSxRQUFRLFFBQVEsU0FBUTtBQUMxQyxVQUFJLENBQUMsTUFBRCxFQUFRO0FBQ1YsY0FBTSxJQUFJLEtBQUosQ0FBVSxrQ0FBa0MsTUFBbEMsR0FBMkMsbUJBQTNDLENBQWhCLENBRFU7T0FBWjtBQUdBLGFBQU8sSUFBSSxNQUFKLENBQVcsTUFBWCxFQUFtQixPQUFuQixDQUFQLENBSjBDOzs7O1NBcEN4Qzs7O0FBMENMOztBQUVELE9BQU8sT0FBUCxHQUFpQixJQUFqQiIsImZpbGUiOiJMZW5pLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIENvbnN1bWVyU3RyZWFtID0gcmVxdWlyZSgnLi9Db25zdW1lclN0cmVhbScpO1xudmFyIFByb2R1Y2VyU3RyZWFtID0gcmVxdWlyZSgnLi9Qcm9kdWNlclN0cmVhbScpO1xudmFyIEZvcm1hdFN0cmVhbSA9IHJlcXVpcmUoJy4vRm9ybWF0U3RyZWFtJyk7XG5cbi8qXG4gKiBUaGlzIGlzIHdoYXQgeW91IGdldCB3aGVuIHlvdSBpbml0aWFsaXplIHRoZSBsaWJyYXJ5LlxuICovXG5jbGFzcyBMZW5pIHtcbiAgY29uc3RydWN0b3IoY2xpZW50LCBjb25zdW1lciwgcHJvZHVjZXIpIHtcbiAgICB0aGlzLmNsaWVudCA9IGNsaWVudDtcbiAgICB0aGlzLmNvbnN1bWVyID0gY29uc3VtZXI7XG4gICAgdGhpcy5wcm9kdWNlciA9IHByb2R1Y2VyO1xuXG4gICAgLy8gcHV0IHRoaXMgc29tZXdoZXJlIGVsc2U/XG4gICAgcHJvY2Vzcy5vbignU0lHVEVSTScsICgpPT4ge1xuICAgICAgdGhpcy5jb25zdW1lci5jbG9zZSh0cnVlLCAoKSA9PiBwcm9jZXNzLmV4aXQoMCkpXG4gICAgfSlcbiAgfTtcblxuICBjb25zdW1lclN0cmVhbShvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuY3JlYXRlU3RyZWFtKENvbnN1bWVyU3RyZWFtLCB0aGlzLmNvbnN1bWVyLCBvcHRpb25zKTtcbiAgfTtcblxuICBwcm9kdWNlclN0cmVhbShvcHRpb25zKSB7XG4gICAgcmV0dXJuIHRoaXMuY29uc3RydWN0b3IuY3JlYXRlU3RyZWFtKFByb2R1Y2VyU3RyZWFtLCB0aGlzLnByb2R1Y2VyLCBvcHRpb25zKTtcbiAgfTtcblxuICBmb3JtYXRTdHJlYW0odG9waWMpIHtcbiAgICByZXR1cm4gbmV3IEZvcm1hdFN0cmVhbSh0b3BpYyk7XG4gIH07XG5cbiAgZm9ybWF0TWVzc2FnZShtc2csIHRvcGljKSB7XG4gICAgcmV0dXJuIEZvcm1hdFN0cmVhbS5fZm9ybWF0UGF5bG9hZChtc2csIHRvcGljKTtcbiAgfVxuXG4gIHNlbmRNZXNzYWdlKG1zZykge1xuICAgIHJldHVybiBQcm9kdWNlclN0cmVhbS5fc2VuZE1lc3NhZ2UodGhpcy5wcm9kdWNlciwgbXNnKTtcbiAgfTtcblxuICBjbG9zZSgpIHtcbiAgICByZXR1cm4gdGhpcy5jbGllbnQuY2xvc2VBc3luYygpO1xuICB9XG5cbiAgc3RhdGljIGNyZWF0ZVN0cmVhbShzdHJlYW0sIHNvdXJjZSwgb3B0aW9ucyl7XG4gICAgaWYgKCFzdHJlYW0pe1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCd5b3UgbmVlZCB0byBwcm9wZXJseSBzZXR1cCBhICcgKyBzb3VyY2UgKyAnIHRvIGdldCBhIHN0cmVhbSEnKTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBzdHJlYW0oc291cmNlLCBvcHRpb25zKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBMZW5pO1xuIl19
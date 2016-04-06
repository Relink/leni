'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var stream = require('stream');

describe('ProducerStream', function () {
  var e1, e2;

  var MockProducer = function MockProducer() {
    _classCallCheck(this, MockProducer);
  };

  ;

  var eddiesMock = {
    create: sinon.stub()
  };

  var ProducerStream = proxyquire('./ProducerStream', {
    '@relinklabs/eddies': eddiesMock
  });

  beforeEach(function () {
    e1 = new EventEmitter();
    e2 = new EventEmitter();
  });

  describe('constructor', function () {
    var eddy;
    var producer = { foo: 'bar ' };
    var sendStub = sinon.stub();

    before(function () {
      return sinon.stub(ProducerStream, '_sendMessage', sendStub);
    });
    beforeEach(function () {
      eddy = new stream.Duplex({
        objectMode: true,
        highWaterMark: 2,
        read: function read() {
          return null;
        },
        write: function write(d, e, c) {
          return c();
        }
      });
      eddiesMock.create.returns(eddy);
      eddiesMock.create.reset();
      ProducerStream._sendMessage.reset();
      sendStub.reset();
    });
    after(function () {
      return ProducerStream._sendMessage.restore();
    });

    it('returns the stream created by eddy when duplex is true', function () {
      var p = new ProducerStream(producer, { duplex: true });
      expect(p).to.equal(eddy);
    });

    it('returns a freely writeable stream when duplex is false', function () {
      var p = new ProducerStream(producer, { duplex: false });

      // simulate a lot of write to show it never blocks up.
      var i = 200;
      while (--i > 0) {
        expect(p.write({ foo: 'bar' })).to.be.true;
      }
    });

    it('properly formats messages for eddies.create', function (done) {
      var p = new ProducerStream('producer', { duplex: false });
      sendStub.returns(Promise.resolve('foo'));
      var fn = eddiesMock.create.firstCall.args[1];
      fn('foo').then(function (res) {
        expect(res).to.deep.equal({ message: 'foo' });
        expect(ProducerStream._sendMessage).to.have.been.calledWith('producer', 'foo');
        done();
      });
    });
  });

  describe('sendMessage', function () {
    it('rejects when not given a correct kafka producer', function (done) {
      ProducerStream._sendMessage({ not: 'a producer' }, {}, 'foo').catch(function (e) {
        expect(e).to.be.instanceof(TypeError);
        done();
      });
    });

    it('sends a message out on a producer!', function (done) {
      var producer = {
        sendAsync: sinon.stub().returns(Promise.resolve('foo'))
      };
      var message = { foo: 'bar' };
      ProducerStream._sendMessage(producer, message).then(function (msg) {
        expect(msg).to.equal('foo');
        expect(producer.sendAsync).to.have.been.calledWith(message);
        done();
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Qcm9kdWNlclN0cmVhbS5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJLE9BQU8sUUFBUSxNQUFSLENBQVA7QUFDSixLQUFLLEdBQUwsQ0FBUyxRQUFRLFlBQVIsQ0FBVDtBQUNBLElBQUksU0FBUyxLQUFLLE1BQUw7QUFDYixJQUFJLFFBQVEsUUFBUSxPQUFSLENBQVI7QUFDSixJQUFJLGFBQWEsUUFBUSxZQUFSLEVBQXNCLFVBQXRCLEVBQWI7QUFDSixJQUFJLFVBQVUsUUFBUSxVQUFSLENBQVY7QUFDSixJQUFJLGVBQWUsUUFBUSxRQUFSLEVBQWtCLFlBQWxCO0FBQ25CLElBQUksU0FBUyxRQUFRLFFBQVIsQ0FBVDs7QUFFSixTQUFTLGdCQUFULEVBQTJCLFlBQU07QUFDL0IsTUFBSSxFQUFKLEVBQVEsRUFBUixDQUQrQjs7TUFHekI7O0lBSHlCOztBQUdWLEdBSFU7O0FBSy9CLE1BQUksYUFBYTtBQUNmLFlBQVEsTUFBTSxJQUFOLEVBQVI7R0FERSxDQUwyQjs7QUFTL0IsTUFBSSxpQkFBaUIsV0FBVyxrQkFBWCxFQUErQjtBQUNsRCwwQkFBc0IsVUFBdEI7R0FEbUIsQ0FBakIsQ0FUMkI7O0FBYS9CLGFBQVcsWUFBTTtBQUNmLFNBQUssSUFBSSxZQUFKLEVBQUwsQ0FEZTtBQUVmLFNBQUssSUFBSSxZQUFKLEVBQUwsQ0FGZTtHQUFOLENBQVgsQ0FiK0I7O0FBa0IvQixXQUFTLGFBQVQsRUFBd0IsWUFBTTtBQUM1QixRQUFJLElBQUosQ0FENEI7QUFFNUIsUUFBSSxXQUFXLEVBQUUsS0FBSyxNQUFMLEVBQWIsQ0FGd0I7QUFHNUIsUUFBSSxXQUFXLE1BQU0sSUFBTixFQUFYLENBSHdCOztBQUs1QixXQUFPO2FBQU0sTUFBTSxJQUFOLENBQVcsY0FBWCxFQUEyQixjQUEzQixFQUEyQyxRQUEzQztLQUFOLENBQVAsQ0FMNEI7QUFNNUIsZUFBVyxZQUFNO0FBQ2YsYUFBTyxJQUFJLE9BQU8sTUFBUCxDQUFj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QVosQ0FBZSxLQUFmLENBQXFCLEtBQXJCLEVBRFk7QUFFWixlQUFPLFNBQVMsU0FBVCxDQUFQLENBQTJCLEVBQTNCLENBQThCLElBQTlCLENBQ0csSUFESCxDQUNRLFVBRFIsQ0FDbUIsT0FEbkIsRUFGWTtBQUlaLGVBSlk7T0FBUCxDQURULENBTCtDO0tBQVIsQ0FBekMsQ0FUNEI7R0FBTixDQUF4QixDQS9EK0I7Q0FBTixDQUEzQiIsImZpbGUiOiJQcm9kdWNlclN0cmVhbS5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNoYWkgPSByZXF1aXJlKCdjaGFpJyk7XG5jaGFpLnVzZShyZXF1aXJlKCdzaW5vbi1jaGFpJykpO1xudmFyIGV4cGVjdCA9IGNoYWkuZXhwZWN0O1xudmFyIHNpbm9uID0gcmVxdWlyZSgnc2lub24nKTtcbnZhciBwcm94eXF1aXJlID0gcmVxdWlyZSgncHJveHlxdWlyZScpLm5vQ2FsbFRocnUoKTtcbnZhciBQcm9taXNlID0gcmVxdWlyZSgnYmx1ZWJpcmQnKTtcbnZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKCdldmVudHMnKS5FdmVudEVtaXR0ZXI7XG52YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG5cbmRlc2NyaWJlKCdQcm9kdWNlclN0cmVhbScsICgpID0+IHtcbiAgdmFyIGUxLCBlMjtcblxuICBjbGFzcyBNb2NrUHJvZHVjZXIge307XG5cbiAgdmFyIGVkZGllc01vY2sgPSB7XG4gICAgY3JlYXRlOiBzaW5vbi5zdHViKClcbiAgfVxuXG4gIHZhciBQcm9kdWNlclN0cmVhbSA9IHByb3h5cXVpcmUoJy4vUHJvZHVjZXJTdHJlYW0nLCB7XG4gICAgJ0ByZWxpbmtsYWJzL2VkZGllcyc6IGVkZGllc01vY2tcbiAgfSk7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgZTEgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gICAgZTIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdjb25zdHJ1Y3RvcicsICgpID0+IHtcbiAgICB2YXIgZWRkeTtcbiAgICB2YXIgcHJvZHVjZXIgPSB7IGZvbzogJ2JhciAnfTtcbiAgICB2YXIgc2VuZFN0dWIgPSBzaW5vbi5zdHViKCk7XG5cbiAgICBiZWZvcmUoKCkgPT4gc2lub24uc3R1YihQcm9kdWNlclN0cmVhbSwgJ19zZW5kTWVzc2FnZScsIHNlbmRTdHViKSk7XG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBlZGR5ID0gbmV3IHN0cmVhbS5EdXBsZXgoe1xuICAgICAgICBvYmplY3RNb2RlOiB0cnVlLFxuICAgICAgICBoaWdoV2F0ZXJNYXJrOiAyLFxuICAgICAgICByZWFkOiAoKSA9PiBudWxsLFxuICAgICAgICB3cml0ZTogKGQsZSxjKSA9PiBjKClcbiAgICAgIH0pO1xuICAgICAgZWRkaWVzTW9jay5jcmVhdGUucmV0dXJucyhlZGR5KTtcbiAgICAgIGVkZGllc01vY2suY3JlYXRlLnJlc2V0KCk7XG4gICAgICBQcm9kdWNlclN0cmVhbS5fc2VuZE1lc3NhZ2UucmVzZXQoKTtcbiAgICAgIHNlbmRTdHViLnJlc2V0KCk7XG4gICAgfSk7XG4gICAgYWZ0ZXIoKCkgPT4gUHJvZHVjZXJTdHJlYW0uX3NlbmRNZXNzYWdlLnJlc3RvcmUoKSk7XG5cbiAgICBpdCgncmV0dXJucyB0aGUgc3RyZWFtIGNyZWF0ZWQgYnkgZWRkeSB3aGVuIGR1cGxleCBpcyB0cnVlJywgKCkgPT4ge1xuICAgICAgdmFyIHAgPSBuZXcgUHJvZHVjZXJTdHJlYW0ocHJvZHVjZXIsIHtkdXBsZXg6IHRydWV9KTtcbiAgICAgIGV4cGVjdChwKS50by5lcXVhbChlZGR5KTtcbiAgICB9KTtcblxuICAgIGl0KCdyZXR1cm5zIGEgZnJlZWx5IHdyaXRlYWJsZSBzdHJlYW0gd2hlbiBkdXBsZXggaXMgZmFsc2UnLCAoKSA9PiB7XG4gICAgICB2YXIgcCA9IG5ldyBQcm9kdWNlclN0cmVhbShwcm9kdWNlciwge2R1cGxleDogZmFsc2V9KTtcblxuICAgICAgLy8gc2ltdWxhdGUgYSBsb3Qgb2Ygd3JpdGUgdG8gc2hvdyBpdCBuZXZlciBibG9ja3MgdXAuXG4gICAgICB2YXIgaSA9IDIwMDtcbiAgICAgIHdoaWxlICgtLWkgPiAwKSBleHBlY3QocC53cml0ZSh7Zm9vOiAnYmFyJ30pKS50by5iZS50cnVlXG4gICAgfSk7XG5cbiAgICBpdCgncHJvcGVybHkgZm9ybWF0cyBtZXNzYWdlcyBmb3IgZWRkaWVzLmNyZWF0ZScsIGRvbmUgPT4ge1xuICAgICAgdmFyIHAgPSBuZXcgUHJvZHVjZXJTdHJlYW0oJ3Byb2R1Y2VyJywge2R1cGxleDogZmFsc2V9KTtcbiAgICAgIHNlbmRTdHViLnJldHVybnMoUHJvbWlzZS5yZXNvbHZlKCdmb28nKSlcbiAgICAgIHZhciBmbiA9IGVkZGllc01vY2suY3JlYXRlLmZpcnN0Q2FsbC5hcmdzWzFdO1xuICAgICAgZm4oJ2ZvbycpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgZXhwZWN0KHJlcykudG8uZGVlcC5lcXVhbCh7IG1lc3NhZ2U6ICdmb28nfSk7XG4gICAgICAgIGV4cGVjdChQcm9kdWNlclN0cmVhbS5fc2VuZE1lc3NhZ2UpLnRvLmhhdmUuYmVlbi5jYWxsZWRXaXRoKCdwcm9kdWNlcicsICdmb28nKVxuICAgICAgICBkb25lKCk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ3NlbmRNZXNzYWdlJywgKCkgPT4ge1xuICAgIGl0KCdyZWplY3RzIHdoZW4gbm90IGdpdmVuIGEgY29ycmVjdCBrYWZrYSBwcm9kdWNlcicsIGRvbmUgPT4ge1xuICAgICAgUHJvZHVjZXJTdHJlYW0uX3NlbmRNZXNzYWdlKHsgbm90OiAnYSBwcm9kdWNlcid9LCB7fSwgJ2ZvbycpXG4gICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICBleHBlY3QoZSkudG8uYmUuaW5zdGFuY2VvZihUeXBlRXJyb3IpO1xuICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICBpdCgnc2VuZHMgYSBtZXNzYWdlIG91dCBvbiBhIHByb2R1Y2VyIScsIGRvbmUgPT4ge1xuICAgICAgdmFyIHByb2R1Y2VyID0ge1xuICAgICAgICBzZW5kQXN5bmM6IHNpbm9uLnN0dWIoKS5yZXR1cm5zKFByb21pc2UucmVzb2x2ZSgnZm9vJykpXG4gICAgICB9O1xuICAgICAgdmFyIG1lc3NhZ2UgPSB7IGZvbzogJ2JhcicgfTtcbiAgICAgIFByb2R1Y2VyU3RyZWFtLl9zZW5kTWVzc2FnZShwcm9kdWNlciwgbWVzc2FnZSlcbiAgICAgICAgLnRoZW4oIG1zZyA9PiB7XG4gICAgICAgICAgZXhwZWN0KG1zZykudG8uZXF1YWwoJ2ZvbycpO1xuICAgICAgICAgIGV4cGVjdChwcm9kdWNlci5zZW5kQXN5bmMpLnRvLmhhdmVcbiAgICAgICAgICAgIC5iZWVuLmNhbGxlZFdpdGgobWVzc2FnZSlcbiAgICAgICAgICBkb25lKCk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuIl19
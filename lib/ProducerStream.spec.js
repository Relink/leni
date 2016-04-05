'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var stream = require('stream');

describe('ProducerStream', function () {
  var e1, e2;

  var MockProducer = function MockProducer() {
    _classCallCheck(this, MockProducer);
  };

  ;
  var kafkaNodeMock = {
    Producer: MockProducer,
    HighLevelProducer: MockProducer,
    Client: sinon.stub(),
    Consumer: sinon.stub()
  };

  var eddiesMock = {
    create: sinon.stub()
  };

  var ProducerStream = proxyquire('./ProducerStream', {
    'kafka-node': kafkaNodeMock,
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
      eddy = new stream.Duplex({ read: function read() {
          return null;
        } });
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
      expect(p instanceof stream.Writable).to.be.true;

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
      var producer = new MockProducer();
      producer.sendAsync = sinon.stub().returns(Promise.resolve('foo'));
      var message = { foo: 'bar' };
      ProducerStream._sendMessage(producer, message).then(function (msg) {
        expect(msg).to.equal('foo');
        expect(producer.sendAsync).to.have.been.calledWith(message);
        done();
      });
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Qcm9kdWNlclN0cmVhbS5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJLE9BQU8sUUFBUSxNQUFSLENBQVA7QUFDSixLQUFLLEdBQUwsQ0FBUyxRQUFRLFlBQVIsQ0FBVDtBQUNBLElBQUksU0FBUyxLQUFLLE1BQUw7QUFDYixJQUFJLFFBQVEsUUFBUSxPQUFSLENBQVI7QUFDSixJQUFJLGFBQWEsUUFBUSxZQUFSLENBQWI7QUFDSixJQUFJLFVBQVUsUUFBUSxVQUFSLENBQVY7QUFDSixJQUFJLGVBQWUsUUFBUSxRQUFSLEVBQWtCLFlBQWxCO0FBQ25CLElBQUksU0FBUyxRQUFRLFFBQVIsQ0FBVDs7QUFFSixTQUFTLGdCQUFULEVBQTJCLFlBQU07QUFDL0IsTUFBSSxFQUFKLEVBQVEsRUFBUixDQUQrQjs7TUFHekI7O0lBSHlCOztBQUdWLEdBSFU7QUFJL0IsTUFBSSxnQkFBZ0I7QUFDbEIsY0FBVSxZQUFWO0FBQ0EsdUJBQW1CLFlBQW5CO0FBQ0EsWUFBUSxNQUFNLElBQU4sRUFBUjtBQUNBLGNBQVUsTUFBTSxJQUFOLEVBQVY7R0FKRSxDQUoyQjs7QUFXL0IsTUFBSSxhQUFhO0FBQ2YsWUFBUSxNQUFNLElBQU4sRUFBUjtHQURFLENBWDJCOztBQWUvQixNQUFJLGlCQUFpQixXQUFXLGtCQUFYLEVBQStCO0FBQ2xELGtCQUFjLGFBQWQ7QUFDQSwwQkFBc0IsVUFBdEI7R0FGbUIsQ0FBakIsQ0FmMkI7O0FBb0IvQixhQUFXLFlBQU07QUFDZixTQUFLLElBQUksWUFBSixFQUFMLENBRGU7QUFFZixTQUFLLElBQUksWUFBSixFQUFMLENBRmU7R0FBTixDQUFYLENBcEIrQjs7QUF5Qi9CLFdBQVMsYUFBVCxFQUF3QixZQUFNO0FBQzVCLFFBQUksSUFBSixDQUQ0QjtBQUU1QixRQUFJLFdBQVcsRUFBRSxLQUFLLE1BQUwsRUFBYixDQUZ3QjtBQUc1QixRQUFJLFdBQVcsTUFBTSxJQUFOLEVBQVgsQ0FId0I7O0FB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ckIsQ0FGK0M7QUFHL0MsVUFBSSxVQUFVLEVBQUUsS0FBSyxLQUFMLEVBQVosQ0FIMkM7QUFJL0MscUJBQWUsWUFBZixDQUE0QixRQUE1QixFQUFzQyxPQUF0QyxFQUNHLElBREgsQ0FDUyxlQUFPO0FBQ1osZUFBTyxHQUFQLEVBQVksRUFBWixDQUFlLEtBQWYsQ0FBcUIsS0FBckIsRUFEWTtBQUVaLGVBQU8sU0FBUyxTQUFULENBQVAsQ0FBMkIsRUFBM0IsQ0FBOEIsSUFBOUIsQ0FDRyxJQURILENBQ1EsVUFEUixDQUNtQixPQURuQixFQUZZO0FBSVosZUFKWTtPQUFQLENBRFQsQ0FKK0M7S0FBUixDQUF6QyxDQVQ0QjtHQUFOLENBQXhCLENBbEUrQjtDQUFOLENBQTNCIiwiZmlsZSI6IlByb2R1Y2VyU3RyZWFtLnNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgY2hhaSA9IHJlcXVpcmUoJ2NoYWknKTtcbmNoYWkudXNlKHJlcXVpcmUoJ3Npbm9uLWNoYWknKSk7XG52YXIgZXhwZWN0ID0gY2hhaS5leHBlY3Q7XG52YXIgc2lub24gPSByZXF1aXJlKCdzaW5vbicpO1xudmFyIHByb3h5cXVpcmUgPSByZXF1aXJlKCdwcm94eXF1aXJlJyk7XG52YXIgUHJvbWlzZSA9IHJlcXVpcmUoJ2JsdWViaXJkJyk7XG52YXIgRXZlbnRFbWl0dGVyID0gcmVxdWlyZSgnZXZlbnRzJykuRXZlbnRFbWl0dGVyO1xudmFyIHN0cmVhbSA9IHJlcXVpcmUoJ3N0cmVhbScpO1xuXG5kZXNjcmliZSgnUHJvZHVjZXJTdHJlYW0nLCAoKSA9PiB7XG4gIHZhciBlMSwgZTI7XG5cbiAgY2xhc3MgTW9ja1Byb2R1Y2VyIHt9O1xuICB2YXIga2Fma2FOb2RlTW9jayA9IHtcbiAgICBQcm9kdWNlcjogTW9ja1Byb2R1Y2VyLFxuICAgIEhpZ2hMZXZlbFByb2R1Y2VyOiBNb2NrUHJvZHVjZXIsXG4gICAgQ2xpZW50OiBzaW5vbi5zdHViKCksXG4gICAgQ29uc3VtZXI6IHNpbm9uLnN0dWIoKVxuICB9O1xuXG4gIHZhciBlZGRpZXNNb2NrID0ge1xuICAgIGNyZWF0ZTogc2lub24uc3R1YigpXG4gIH1cblxuICB2YXIgUHJvZHVjZXJTdHJlYW0gPSBwcm94eXF1aXJlKCcuL1Byb2R1Y2VyU3RyZWFtJywge1xuICAgICdrYWZrYS1ub2RlJzoga2Fma2FOb2RlTW9jayxcbiAgICAnQHJlbGlua2xhYnMvZWRkaWVzJzogZWRkaWVzTW9ja1xuICB9KTtcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBlMSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgICBlMiA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2NvbnN0cnVjdG9yJywgKCkgPT4ge1xuICAgIHZhciBlZGR5O1xuICAgIHZhciBwcm9kdWNlciA9IHsgZm9vOiAnYmFyICd9O1xuICAgIHZhciBzZW5kU3R1YiA9IHNpbm9uLnN0dWIoKTtcblxuICAgIGJlZm9yZSgoKSA9PiBzaW5vbi5zdHViKFByb2R1Y2VyU3RyZWFtLCAnX3NlbmRNZXNzYWdlJywgc2VuZFN0dWIpKTtcbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICAgIGVkZHkgPSBuZXcgc3RyZWFtLkR1cGxleCh7IHJlYWQ6ICgpID0+IG51bGx9KTtcbiAgICAgIGVkZGllc01vY2suY3JlYXRlLnJldHVybnMoZWRkeSk7XG4gICAgICBlZGRpZXNNb2NrLmNyZWF0ZS5yZXNldCgpO1xuICAgICAgUHJvZHVjZXJTdHJlYW0uX3NlbmRNZXNzYWdlLnJlc2V0KCk7XG4gICAgICBzZW5kU3R1Yi5yZXNldCgpO1xuICAgIH0pO1xuICAgIGFmdGVyKCgpID0+IFByb2R1Y2VyU3RyZWFtLl9zZW5kTWVzc2FnZS5yZXN0b3JlKCkpO1xuXG4gICAgaXQoJ3JldHVybnMgdGhlIHN0cmVhbSBjcmVhdGVkIGJ5IGVkZHkgd2hlbiBkdXBsZXggaXMgdHJ1ZScsICgpID0+IHtcbiAgICAgIHZhciBwID0gbmV3IFByb2R1Y2VyU3RyZWFtKHByb2R1Y2VyLCB7ZHVwbGV4OiB0cnVlfSk7XG4gICAgICBleHBlY3QocCkudG8uZXF1YWwoZWRkeSk7XG4gICAgfSk7XG5cbiAgICBpdCgncmV0dXJucyBhIGZyZWVseSB3cml0ZWFibGUgc3RyZWFtIHdoZW4gZHVwbGV4IGlzIGZhbHNlJywgKCkgPT4ge1xuICAgICAgdmFyIHAgPSBuZXcgUHJvZHVjZXJTdHJlYW0ocHJvZHVjZXIsIHtkdXBsZXg6IGZhbHNlfSk7XG4gICAgICBleHBlY3QocCBpbnN0YW5jZW9mIHN0cmVhbS5Xcml0YWJsZSkudG8uYmUudHJ1ZTtcblxuICAgICAgLy8gc2ltdWxhdGUgYSBsb3Qgb2Ygd3JpdGUgdG8gc2hvdyBpdCBuZXZlciBibG9ja3MgdXAuXG4gICAgICB2YXIgaSA9IDIwMDtcbiAgICAgIHdoaWxlICgtLWkgPiAwKSBleHBlY3QocC53cml0ZSh7Zm9vOiAnYmFyJ30pKS50by5iZS50cnVlXG4gICAgfSk7XG5cbiAgICBpdCgncHJvcGVybHkgZm9ybWF0cyBtZXNzYWdlcyBmb3IgZWRkaWVzLmNyZWF0ZScsIGRvbmUgPT4ge1xuICAgICAgdmFyIHAgPSBuZXcgUHJvZHVjZXJTdHJlYW0oJ3Byb2R1Y2VyJywge2R1cGxleDogZmFsc2V9KTtcbiAgICAgIHNlbmRTdHViLnJldHVybnMoUHJvbWlzZS5yZXNvbHZlKCdmb28nKSlcbiAgICAgIHZhciBmbiA9IGVkZGllc01vY2suY3JlYXRlLmZpcnN0Q2FsbC5hcmdzWzFdO1xuICAgICAgZm4oJ2ZvbycpLnRoZW4ocmVzID0+IHtcbiAgICAgICAgZXhwZWN0KHJlcykudG8uZGVlcC5lcXVhbCh7IG1lc3NhZ2U6ICdmb28nfSk7XG4gICAgICAgIGV4cGVjdChQcm9kdWNlclN0cmVhbS5fc2VuZE1lc3NhZ2UpLnRvLmhhdmUuYmVlbi5jYWxsZWRXaXRoKCdwcm9kdWNlcicsICdmb28nKVxuICAgICAgICBkb25lKCk7XG4gICAgICB9KTtcbiAgICB9KVxuICB9KTtcblxuICBkZXNjcmliZSgnc2VuZE1lc3NhZ2UnLCAoKSA9PiB7XG4gICAgaXQoJ3JlamVjdHMgd2hlbiBub3QgZ2l2ZW4gYSBjb3JyZWN0IGthZmthIHByb2R1Y2VyJywgZG9uZSA9PiB7XG4gICAgICBQcm9kdWNlclN0cmVhbS5fc2VuZE1lc3NhZ2UoeyBub3Q6ICdhIHByb2R1Y2VyJ30sIHt9LCAnZm9vJylcbiAgICAgICAgLmNhdGNoKGUgPT4ge1xuICAgICAgICAgIGV4cGVjdChlKS50by5iZS5pbnN0YW5jZW9mKFR5cGVFcnJvcik7XG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGl0KCdzZW5kcyBhIG1lc3NhZ2Ugb3V0IG9uIGEgcHJvZHVjZXIhJywgZG9uZSA9PiB7XG4gICAgICB2YXIgcHJvZHVjZXIgPSBuZXcgTW9ja1Byb2R1Y2VyKCk7XG4gICAgICBwcm9kdWNlci5zZW5kQXN5bmMgPSBzaW5vbi5zdHViKCkucmV0dXJucyhQcm9taXNlLnJlc29sdmUoJ2ZvbycpKTtcbiAgICAgIHZhciBtZXNzYWdlID0geyBmb286ICdiYXInIH07XG4gICAgICBQcm9kdWNlclN0cmVhbS5fc2VuZE1lc3NhZ2UocHJvZHVjZXIsIG1lc3NhZ2UpXG4gICAgICAgIC50aGVuKCBtc2cgPT4ge1xuICAgICAgICAgIGV4cGVjdChtc2cpLnRvLmVxdWFsKCdmb28nKTtcbiAgICAgICAgICBleHBlY3QocHJvZHVjZXIuc2VuZEFzeW5jKS50by5oYXZlXG4gICAgICAgICAgICAuYmVlbi5jYWxsZWRXaXRoKG1lc3NhZ2UpXG4gICAgICAgICAgZG9uZSgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59KTtcbiJdfQ==
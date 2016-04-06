var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire').noCallThru();
var Promise = require('bluebird');
var EventEmitter = require('events').EventEmitter;
var stream = require('stream');

describe('ProducerStream', () => {
  var e1, e2;

  class MockProducer {};

  var eddiesMock = {
    create: sinon.stub()
  }

  var ProducerStream = proxyquire('./ProducerStream', {
    '@relinklabs/eddies': eddiesMock
  });

  beforeEach(() => {
    e1 = new EventEmitter();
    e2 = new EventEmitter();
  });

  describe('constructor', () => {
    var eddy;
    var producer = { foo: 'bar '};
    var sendStub = sinon.stub();

    before(() => sinon.stub(ProducerStream, '_sendMessage', sendStub));
    beforeEach(() => {
      eddy = new stream.Duplex({
        objectMode: true,
        highWaterMark: 2,
        read: () => null,
        write: (d,e,c) => c()
      });
      eddiesMock.create.returns(eddy);
      eddiesMock.create.reset();
      ProducerStream._sendMessage.reset();
      sendStub.reset();
    });
    after(() => ProducerStream._sendMessage.restore());

    it('returns the stream created by eddy when duplex is true', () => {
      var p = new ProducerStream(producer, {duplex: true});
      expect(p).to.equal(eddy);
    });

    it('returns a freely writeable stream when duplex is false', () => {
      var p = new ProducerStream(producer, {duplex: false});

      // simulate a lot of write to show it never blocks up.
      var i = 200;
      while (--i > 0) expect(p.write({foo: 'bar'})).to.be.true
    });

    it('properly formats messages for eddies.create', done => {
      var p = new ProducerStream('producer', {duplex: false});
      sendStub.returns(Promise.resolve('foo'))
      var fn = eddiesMock.create.firstCall.args[1];
      fn('foo').then(res => {
        expect(res).to.deep.equal({ message: 'foo'});
        expect(ProducerStream._sendMessage).to.have.been.calledWith('producer', 'foo')
        done();
      });
    });
  });

  describe('sendMessage', () => {
    it('rejects when not given a correct kafka producer', done => {
      ProducerStream._sendMessage({ not: 'a producer'}, {}, 'foo')
        .catch(e => {
          expect(e).to.be.instanceof(TypeError);
          done();
        });
    });

    it('sends a message out on a producer!', done => {
      var producer = {
        sendAsync: sinon.stub().returns(Promise.resolve('foo'))
      };
      var message = { foo: 'bar' };
      ProducerStream._sendMessage(producer, message)
        .then( msg => {
          expect(msg).to.equal('foo');
          expect(producer.sendAsync).to.have
            .been.calledWith(message)
          done();
        });
    });
  });
});

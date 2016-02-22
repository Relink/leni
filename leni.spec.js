var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');
var EventEmitter = require('events').EventEmitter;

var clientStub = sinon.stub();
var consumerStub = sinon.stub();
var producerStub = sinon.stub();

var leni = proxyquire('./index.js', {
  init: proxyquire('./lib/init', {
    'kafka-node': {
      Client: clientStub,
      HighLevelProducer: producerStub,
      HighLevelConsumer: consumerStub
    }
  })
});

describe('leni', () => {
  describe('createStream', () => {
    var e1, e2;

    beforeEach(() => {
      e1 = new EventEmitter();
      e2 = new EventEmitter();
    });

    it('passes the Client method as Client', () => {
      var client = new leni.Client();
      expect(clientStub).to.have.been.called;
    });

    it('passes the HighLevelProducer method as Producer', () => {
      var producer = new leni.Producer();
      expect(producerStub).to.have.been.called;
    });

    it('throws descriptive errors when not given proper producer', () => {
      leni.createStream('client', 'notaproducer')
        .catch(err => expect(err).to.be.instanceof(TypeError));
    });

    it('passes consumer options through to the consumer', done => {
      var payloads = { foo: 'bar' };
      var options = { baz: 'qux'};

      var client = {};
      var producer = e1;

      consumerStub.returns(e2);

      leni.createStream(client, producer, [{ payloads: payloads, options: options}] )
        .then(stream => {
          expect(consumerStub).to.have.been.calledWith(client, payloads, options);
          done();
        });

      e1.emit('ready');
    });

    it('creates a stream which is an EventEmitter object', done => {
      producerStub.returns(e1);
      consumerStub.returns(e2);

      var client = new leni.Client();
      var producer = new leni.Producer();
      leni.createStream(client, producer, [{payloads: 'foo'}])
        .then(stream => {
          expect(stream).to.be.instanceof(EventEmitter)
          done();
        });

      e1.emit('ready');
    });
  });
});

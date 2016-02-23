var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');

var EventEmitter = require('events').EventEmitter;
var emitter = require('./emitter');

describe('emitter', () => {

  describe('combineEmitters', () => {
    var e1;
    var e2;

    beforeEach(() => {
      e1 = new EventEmitter();
      e2 = new EventEmitter();
    });

    it('gathers multiple channels into one' , () => {
      var originals = [e1, e2];
      var topics = ['foo', 'bar'];
      var newEmitter = emitter.combineEmitters(originals, topics);
      var channel = sinon.spy();
      newEmitter.on('foo', channel);
      e1.emit('foo', 'e1');
      e2.emit('foo', 'e2');

      expect(channel).to.have.been.calledTwice;
      expect(channel.firstCall).calledWith('e1');
      expect(channel.secondCall).calledWith('e2');
    });

    it('gathers errors into one channel', () => {
      var originals = [e1, e2];
      var topics = ['error'];
      var newEmitter = emitter.combineEmitters(originals, topics);
      var channel = sinon.spy();
      newEmitter.on('error', channel);
      e1.emit('error', new TypeError('foo'));
      expect(channel.firstCall.args[0]).to.be.an('error');
    });

    it('throws informative error when not given EventEmitters', () => {
      expect(emitter.combineEmitters.bind(
        null,
        [{ foo: 'bar' }]))
        .to.throw(/EventEmitter interface/);
    });
  });


  describe('_formatPayload', () => {
    var data = {
      foo: 'bar'
    };

    it('makes messages into a string', () => {
      var payload = emitter._formatPayload(data, 'baz');
      expect(payload).to.be.an('array')
      expect(payload[0].messages).to.be.a('string')
    });

    it('makes the topic whatever the topic should be', () => {
      var payload = emitter._formatPayload(data, 'baz');
      expect(payload[0].topic).to.equal('baz')
    });

    it('throws when not given a topic', () => {
      expect(emitter._formatPayload.bind(null, data)).to.throw()
    });

    it('works with arrays', () => {
      var arr = ['foo', 'bar']
      var payload = emitter._formatPayload(arr, 'baz');
      expect(payload[0].messages).to.equal('foo');
    });

  });

  describe('sendMessage', () => {
    it('rejects when not given a correct kafka producer', done => {
      emitter.sendMessage({ not: 'a producer'}, {}, 'foo')
        .catch(e => {
          expect(e).to.be.instanceof(TypeError);
          done();
        });
    });

    it('sends a message out on a producer!', done => {
      var kafka = require('kafka-node');
      var client = new kafka.Client();
      var producer = new kafka.Producer(client);
      producer.send = sinon.stub().callsArgWith(1, null, 'foo');

      emitter.sendMessage(producer, {}, 'topic').then( msg => {
        expect(msg).to.equal('foo');
        expect(producer.send).to.have
          .been.calledWith([{ messages: '{}', topic: 'topic'}]);
        done();
      });

    });
  });
});

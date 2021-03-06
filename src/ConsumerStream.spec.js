var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var kafka = require('kafka-node');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var ConsumerStream = require('./ConsumerStream');

describe.only('ConsumerStream', () => {
  var client;
  var consumer;
  var consumerMock;

  beforeEach(() => {
    client = new kafka.Client();
    consumer = new kafka.Consumer(client, [{ topic: 'foo' }]);
    sinon.spy(consumer, 'pause');
    sinon.spy(consumer, 'resume');
    consumerMock = _.merge(new EventEmitter, {
      pause: sinon.stub(),
      resume: sinon.stub(),
      setOffset: sinon.stub()
    });
  })

  it('starts the consumer paused', () => {
    var stream = new ConsumerStream(consumer);
    expect(consumer.paused).to.be.true;
  });

  it('starts the consumer when given a data listener', done => {
    var stream = new ConsumerStream(consumer);
    stream.on('readable', () => true);
    process.nextTick(() => {
      expect(consumer.paused).to.be.false;
      done()
    });
  });

  it('runs in object mode', done => {
    var stream = new ConsumerStream(consumerMock);
    stream.on('data', obj => {
      expect(obj).to.be.an('object');
      expect(obj.foo).to.equal('bar');
      done();
    });
    consumerMock.emit('message', { foo: 'bar' });
  });

  it('forwards errors from the consumer stream', done => {
    var stream = new ConsumerStream(consumerMock);
    stream.on('error', err => {
      expect(err).to.be.an('error');
      done();
    });
    consumerMock.emit('error', new Error('foo'));
  });

  it('pauses consumer when stream is paused and highWaterMark is reached', done => {

    /*
     * By setting the highWaterMark to 2, we have a buffer that doesnt fit even
     * one message, and by pressing pause after the first event, we simulate an
     * overloaded downstream process. The correct behavior is then to pause the
     * consumer and reset the consumers offset to the current message, so it's
     * not lost.
     */
    var stream = new ConsumerStream(consumerMock, { highWaterMark: 2});
    var callCount = 0;
    stream.on('data', obj => {
      callCount++;
      stream.pause();
    })
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 1});
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 2});
    process.nextTick(() => {
      expect(callCount).to.equal(1);
      expect(consumerMock.pause).to.have.been.calledTwice;
      done();
    });
  });


  it('does not pause consumer when paused, if it hasnt reached its highWaterMark', done => {
    var stream = new ConsumerStream(consumerMock, { highWaterMark: 32 });
    var callCount = 0;
    stream.on('data', obj => {
      callCount ++;
      stream.pause();
    });
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 1});
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 2});
    process.nextTick(() => {
      expect(callCount).to.equal(1);
      expect(consumerMock.pause).to.have.been.calledOnce;
      done();
    });
  });

  it('implements Streams2 and works with read loops as well!', done => {

    /*
     * Here we simulate two reads, an implicit pause due to read() not being
     * called, which causes the buffer to fill, a highWaterMark set to hold exactly
     * one message in the buffer, and the last message causing the backpressure
     * to kick in and the consumer to be paused and then resumed later.
     */
    var stream = new ConsumerStream(consumerMock, { highWaterMark: 4});
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 1});
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 2});
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 3});
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 4});

    var messages = [];
    var i = 2;

    while (i > 0) {
      messages.push(stream.read());
      i--;
    };

    process.nextTick(() => {
      expect(messages.length).to.equal(2)
      expect(consumerMock.pause).to.have.been.calledTwice;
      expect(stream.read().offset).to.equal(3)
      done();
    });
  });
});

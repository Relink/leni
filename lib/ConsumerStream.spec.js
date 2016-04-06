'use strict';

var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var kafka = require('kafka-node');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

var ConsumerStream = require('./ConsumerStream');

describe('ConsumerStream', function () {
  var client;
  var consumer;
  var consumerMock;

  beforeEach(function () {
    client = new kafka.Client();
    consumer = new kafka.Consumer(client, [{ topic: 'foo' }]);
    consumerMock = _.merge(new EventEmitter(), {
      pause: sinon.stub(),
      resume: sinon.stub(),
      setOffset: sinon.stub()
    });
  });

  it('starts the consumer paused', function () {
    var stream = new ConsumerStream(consumer);
    sinon.spy(consumer, 'pause');
    expect(consumer.paused).to.be.true;
  });

  it('starts the consumer when given a data listener', function (done) {
    var stream = new ConsumerStream(consumer);
    stream.on('data', function () {
      return true;
    });
    process.nextTick(function () {
      expect(consumer.paused).to.be.false;
      done();
    });
  });

  it('runs in object mode', function (done) {
    var stream = new ConsumerStream(consumerMock);
    stream.on('data', function (obj) {
      expect(obj).to.be.an('object');
      expect(obj.foo).to.equal('bar');
      done();
    });
    consumerMock.emit('message', { foo: 'bar' });
  });

  it('forwards errors from the consumer stream', function (done) {
    var stream = new ConsumerStream(consumerMock);
    stream.on('error', function (err) {
      expect(err).to.be.an('error');
      done();
    });
    consumerMock.emit('error', new Error('foo'));
  });

  it('pauses consumer when stream is paused and highWaterMark is reached', function (done) {

    /*
     * By setting the highWaterMark to 2, we have a buffer that doesnt fit even
     * one message, and by pressing pause after the first event, we simulate an
     * overloaded downstream process. The correct behavior is then to pause the
     * consumer and reset the consumers offset to the current message, so it's
     * not lost.
     */
    var stream = new ConsumerStream(consumerMock, { highWaterMark: 2 });
    var callCount = 0;
    stream.on('data', function (obj) {
      callCount++;
      stream.pause();
    });
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 1 });
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 2 });
    process.nextTick(function () {
      expect(callCount).to.equal(1);
      expect(consumerMock.pause).to.have.been.calledTwice;
      done();
    });
  });

  it('does not pause consumer when paused, if it hasnt reached its highWaterMark', function (done) {
    var stream = new ConsumerStream(consumerMock, { highWaterMark: 32 });
    var callCount = 0;
    stream.on('data', function (obj) {
      callCount++;
      stream.pause();
    });
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 1 });
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 2 });
    process.nextTick(function () {
      expect(callCount).to.equal(1);
      expect(consumerMock.pause).to.have.been.calledOnce;
      done();
    });
  });

  it('implements Streams2 and works with read loops as well!', function (done) {

    /*
     * Here we simulate two reads, an implicit pause due to read() not being
     * called, which causes the buffer to fill, a highWaterMark set to hold exactly
     * one message in the buffer, and the last message causing the backpressure
     * to kick in and the consumer to be paused and then resumed later.
     */
    var stream = new ConsumerStream(consumerMock, { highWaterMark: 4 });
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 1 });
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 2 });
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 3 });
    consumerMock.emit('message', { foo: 'bar', topic: 'baz', partition: 1, offset: 4 });

    var messages = [];
    var i = 2;

    while (i > 0) {
      messages.push(stream.read());
      i--;
    };

    process.nextTick(function () {
      expect(messages.length).to.equal(2);
      expect(consumerMock.pause).to.have.been.calledTwice;
      expect(stream.read().offset).to.equal(3);
      done();
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db25zdW1lclN0cmVhbS5zcGVjLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsSUFBSSxPQUFPLFFBQVEsTUFBUixDQUFQO0FBQ0osS0FBSyxHQUFMLENBQVMsUUFBUSxZQUFSLENBQVQ7QUFDQSxJQUFJLFNBQVMsS0FBSyxNQUFMO0FBQ2IsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFSO0FBQ0osSUFBSSxRQUFRLFFBQVEsWUFBUixDQUFSO0FBQ0osSUFBSSxJQUFJLFFBQVEsUUFBUixDQUFKO0FBQ0osSUFBSSxlQUFlLFFBQVEsUUFBUixFQUFrQixZQUFsQjs7QUFFbkIsSUFBSSxpQkFBaUIsUUFBUSxrQkFBUixDQUFqQjs7QUFFSixTQUFTLGdCQUFULEVBQTJCLFlBQU07QUFDL0IsTUFBSSxNQUFKLENBRCtCO0FBRS9CLE1BQUksUUFBSixDQUYrQjtBQUcvQixNQUFJLFlBQUosQ0FIK0I7O0FBSy9CLGFBQVcsWUFBTTtBQUNmLGFBQVMsSUFBSSxNQUFNLE1BQU4sRUFBYixDQURlO0FBRWYsZUFBVyxJQUFJLE1BQU0sUUFBTixDQUFlLE1BQW5CLEVBQTJCLENBQUMsRUFBRSxPQUFPLEtBQVAsRUFBSCxDQUEzQixDQUFYLENBRmU7QUFHZixtQkFBZSxFQUFFLEtBQUYsQ0FBUSxJQUFJLFlBQUosRUFBUixFQUEwQjtBQUN2QyxhQUFPLE1BQU0sSUFBTixFQUFQO0FBQ0EsY0FBUSxNQUFNLElBQU4sRUFBUjtBQUNBLGlCQUFXLE1BQU0sSUFBTixFQUFYO0tBSGEsQ0FBZixDQUhlO0dBQU4sQ0FBWCxDQUwrQjs7QUFlL0IsS0FBRyw0QkFBSCxFQUFpQyxZQUFNO0FBQ3JDLFFBQUksU0FBUyxJQUFJLGNBQUosQ0FBbUIsUUFBbkIsQ0FBVCxDQURpQztBQUVyQyxVQUFNLEdBQU4sQ0FBVSxRQUFWLEVBQW9CLE9BQXBCLEVBRnFDO0FBR3JDLFdBQU8sU0FBUyxNQUFULENBQVAsQ0FBd0IsRUFBeEIsQ0FBMkIsRUFBM0IsQ0FBOEIsSUFB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WG1FO0FBWW5FLGlCQUFhLElBQWIsQ0FBa0IsU0FBbEIsRUFBNkIsRUFBRSxLQUFLLEtBQUwsRUFBWSxPQUFPLEtBQVAsRUFBYyxXQUFXLENBQVgsRUFBYyxRQUFRLENBQVIsRUFBdkUsRUFabUU7O0FBY25FLFFBQUksV0FBVyxFQUFYLENBZCtEO0FBZW5FLFFBQUksSUFBSSxDQUFKLENBZitEOztBQWlCbkUsV0FBTyxJQUFJLENBQUosRUFBTztBQUNaLGVBQVMsSUFBVCxDQUFjLE9BQU8sSUFBUCxFQUFkLEVBRFk7QUFFWixVQUZZO0tBQWQsQ0FqQm1FOztBQXNCbkUsWUFBUSxRQUFSLENBQWlCLFlBQU07QUFDckIsYUFBTyxTQUFTLE1BQVQsQ0FBUCxDQUF3QixFQUF4QixDQUEyQixLQUEzQixDQUFpQyxDQUFqQyxFQURxQjtBQUVyQixhQUFPLGFBQWEsS0FBYixDQUFQLENBQTJCLEVBQTNCLENBQThCLElBQTlCLENBQW1DLElBQW5DLENBQXdDLFdBQXhDLENBRnFCO0FBR3JCLGFBQU8sT0FBTyxJQUFQLEdBQWMsTUFBZCxDQUFQLENBQTZCLEVBQTdCLENBQWdDLEtBQWhDLENBQXNDLENBQXRDLEVBSHFCO0FBSXJCLGFBSnFCO0tBQU4sQ0FBakIsQ0F0Qm1FO0dBQVIsQ0FBN0QsQ0ExRitCO0NBQU4sQ0FBM0IiLCJmaWxlIjoiQ29uc3VtZXJTdHJlYW0uc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbInZhciBjaGFpID0gcmVxdWlyZSgnY2hhaScpO1xuY2hhaS51c2UocmVxdWlyZSgnc2lub24tY2hhaScpKTtcbnZhciBleHBlY3QgPSBjaGFpLmV4cGVjdDtcbnZhciBzaW5vbiA9IHJlcXVpcmUoJ3Npbm9uJyk7XG52YXIga2Fma2EgPSByZXF1aXJlKCdrYWZrYS1ub2RlJyk7XG52YXIgXyA9IHJlcXVpcmUoJ2xvZGFzaCcpO1xudmFyIEV2ZW50RW1pdHRlciA9IHJlcXVpcmUoJ2V2ZW50cycpLkV2ZW50RW1pdHRlcjtcblxudmFyIENvbnN1bWVyU3RyZWFtID0gcmVxdWlyZSgnLi9Db25zdW1lclN0cmVhbScpO1xuXG5kZXNjcmliZSgnQ29uc3VtZXJTdHJlYW0nLCAoKSA9PiB7XG4gIHZhciBjbGllbnQ7XG4gIHZhciBjb25zdW1lcjtcbiAgdmFyIGNvbnN1bWVyTW9jaztcblxuICBiZWZvcmVFYWNoKCgpID0+IHtcbiAgICBjbGllbnQgPSBuZXcga2Fma2EuQ2xpZW50KCk7XG4gICAgY29uc3VtZXIgPSBuZXcga2Fma2EuQ29uc3VtZXIoY2xpZW50LCBbeyB0b3BpYzogJ2ZvbycgfV0pO1xuICAgIGNvbnN1bWVyTW9jayA9IF8ubWVyZ2UobmV3IEV2ZW50RW1pdHRlciwge1xuICAgICAgcGF1c2U6IHNpbm9uLnN0dWIoKSxcbiAgICAgIHJlc3VtZTogc2lub24uc3R1YigpLFxuICAgICAgc2V0T2Zmc2V0OiBzaW5vbi5zdHViKClcbiAgICB9KTtcbiAgfSlcblxuICBpdCgnc3RhcnRzIHRoZSBjb25zdW1lciBwYXVzZWQnLCAoKSA9PiB7XG4gICAgdmFyIHN0cmVhbSA9IG5ldyBDb25zdW1lclN0cmVhbShjb25zdW1lcik7XG4gICAgc2lub24uc3B5KGNvbnN1bWVyLCAncGF1c2UnKTtcbiAgICBleHBlY3QoY29uc3VtZXIucGF1c2VkKS50by5iZS50cnVlO1xuICB9KTtcblxuICBpdCgnc3RhcnRzIHRoZSBjb25zdW1lciB3aGVuIGdpdmVuIGEgZGF0YSBsaXN0ZW5lcicsIGRvbmUgPT4ge1xuICAgIHZhciBzdHJlYW0gPSBuZXcgQ29uc3VtZXJTdHJlYW0oY29uc3VtZXIpO1xuICAgIHN0cmVhbS5vbignZGF0YScsICgpID0+IHRydWUpO1xuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgZXhwZWN0KGNvbnN1bWVyLnBhdXNlZCkudG8uYmUuZmFsc2U7XG4gICAgICBkb25lKClcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ3J1bnMgaW4gb2JqZWN0IG1vZGUnLCBkb25lID0+IHtcbiAgICB2YXIgc3RyZWFtID0gbmV3IENvbnN1bWVyU3RyZWFtKGNvbnN1bWVyTW9jayk7XG4gICAgc3RyZWFtLm9uKCdkYXRhJywgb2JqID0+IHtcbiAgICAgIGV4cGVjdChvYmopLnRvLmJlLmFuKCdvYmplY3QnKTtcbiAgICAgIGV4cGVjdChvYmouZm9vKS50by5lcXVhbCgnYmFyJyk7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gICAgY29uc3VtZXJNb2NrLmVtaXQoJ21lc3NhZ2UnLCB7IGZvbzogJ2JhcicgfSk7XG4gIH0pO1xuXG4gIGl0KCdmb3J3YXJkcyBlcnJvcnMgZnJvbSB0aGUgY29uc3VtZXIgc3RyZWFtJywgZG9uZSA9PiB7XG4gICAgdmFyIHN0cmVhbSA9IG5ldyBDb25zdW1lclN0cmVhbShjb25zdW1lck1vY2spO1xuICAgIHN0cmVhbS5vbignZXJyb3InLCBlcnIgPT4ge1xuICAgICAgZXhwZWN0KGVycikudG8uYmUuYW4oJ2Vycm9yJyk7XG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gICAgY29uc3VtZXJNb2NrLmVtaXQoJ2Vycm9yJywgbmV3IEVycm9yKCdmb28nKSk7XG4gIH0pO1xuXG4gIGl0KCdwYXVzZXMgY29uc3VtZXIgd2hlbiBzdHJlYW0gaXMgcGF1c2VkIGFuZCBoaWdoV2F0ZXJNYXJrIGlzIHJlYWNoZWQnLCBkb25lID0+IHtcblxuICAgIC8qXG4gICAgICogQnkgc2V0dGluZyB0aGUgaGlnaFdhdGVyTWFyayB0byAyLCB3ZSBoYXZlIGEgYnVmZmVyIHRoYXQgZG9lc250IGZpdCBldmVuXG4gICAgICogb25lIG1lc3NhZ2UsIGFuZCBieSBwcmVzc2luZyBwYXVzZSBhZnRlciB0aGUgZmlyc3QgZXZlbnQsIHdlIHNpbXVsYXRlIGFuXG4gICAgICogb3ZlcmxvYWRlZCBkb3duc3RyZWFtIHByb2Nlc3MuIFRoZSBjb3JyZWN0IGJlaGF2aW9yIGlzIHRoZW4gdG8gcGF1c2UgdGhlXG4gICAgICogY29uc3VtZXIgYW5kIHJlc2V0IHRoZSBjb25zdW1lcnMgb2Zmc2V0IHRvIHRoZSBjdXJyZW50IG1lc3NhZ2UsIHNvIGl0J3NcbiAgICAgKiBub3QgbG9zdC5cbiAgICAgKi9cbiAgICB2YXIgc3RyZWFtID0gbmV3IENvbnN1bWVyU3RyZWFtKGNvbnN1bWVyTW9jaywgeyBoaWdoV2F0ZXJNYXJrOiAyfSk7XG4gICAgdmFyIGNhbGxDb3VudCA9IDA7XG4gICAgc3RyZWFtLm9uKCdkYXRhJywgb2JqID0+IHtcbiAgICAgIGNhbGxDb3VudCsrO1xuICAgICAgc3RyZWFtLnBhdXNlKCk7XG4gICAgfSlcbiAgICBjb25zdW1lck1vY2suZW1pdCgnbWVzc2FnZScsIHsgZm9vOiAnYmFyJywgdG9waWM6ICdiYXonLCBwYXJ0aXRpb246IDEsIG9mZnNldDogMX0pO1xuICAgIGNvbnN1bWVyTW9jay5lbWl0KCdtZXNzYWdlJywgeyBmb286ICdiYXInLCB0b3BpYzogJ2JheicsIHBhcnRpdGlvbjogMSwgb2Zmc2V0OiAyfSk7XG4gICAgcHJvY2Vzcy5uZXh0VGljaygoKSA9PiB7XG4gICAgICBleHBlY3QoY2FsbENvdW50KS50by5lcXVhbCgxKTtcbiAgICAgIGV4cGVjdChjb25zdW1lck1vY2sucGF1c2UpLnRvLmhhdmUuYmVlbi5jYWxsZWRUd2ljZTtcbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgfSk7XG5cblxuICBpdCgnZG9lcyBub3QgcGF1c2UgY29uc3VtZXIgd2hlbiBwYXVzZWQsIGlmIGl0IGhhc250IHJlYWNoZWQgaXRzIGhpZ2hXYXRlck1hcmsnLCBkb25lID0+IHtcbiAgICB2YXIgc3RyZWFtID0gbmV3IENvbnN1bWVyU3RyZWFtKGNvbnN1bWVyTW9jaywgeyBoaWdoV2F0ZXJNYXJrOiAzMiB9KTtcbiAgICB2YXIgY2FsbENvdW50ID0gMDtcbiAgICBzdHJlYW0ub24oJ2RhdGEnLCBvYmogPT4ge1xuICAgICAgY2FsbENvdW50ICsrO1xuICAgICAgc3RyZWFtLnBhdXNlKCk7XG4gICAgfSk7XG4gICAgY29uc3VtZXJNb2NrLmVtaXQoJ21lc3NhZ2UnLCB7IGZvbzogJ2JhcicsIHRvcGljOiAnYmF6JywgcGFydGl0aW9uOiAxLCBvZmZzZXQ6IDF9KTtcbiAgICBjb25zdW1lck1vY2suZW1pdCgnbWVzc2FnZScsIHsgZm9vOiAnYmFyJywgdG9waWM6ICdiYXonLCBwYXJ0aXRpb246IDEsIG9mZnNldDogMn0pO1xuICAgIHByb2Nlc3MubmV4dFRpY2soKCkgPT4ge1xuICAgICAgZXhwZWN0KGNhbGxDb3VudCkudG8uZXF1YWwoMSk7XG4gICAgICBleHBlY3QoY29uc3VtZXJNb2NrLnBhdXNlKS50by5oYXZlLmJlZW4uY2FsbGVkT25jZTtcbiAgICAgIGRvbmUoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgaXQoJ2ltcGxlbWVudHMgU3RyZWFtczIgYW5kIHdvcmtzIHdpdGggcmVhZCBsb29wcyBhcyB3ZWxsIScsIGRvbmUgPT4ge1xuXG4gICAgLypcbiAgICAgKiBIZXJlIHdlIHNpbXVsYXRlIHR3byByZWFkcywgYW4gaW1wbGljaXQgcGF1c2UgZHVlIHRvIHJlYWQoKSBub3QgYmVpbmdcbiAgICAgKiBjYWxsZWQsIHdoaWNoIGNhdXNlcyB0aGUgYnVmZmVyIHRvIGZpbGwsIGEgaGlnaFdhdGVyTWFyayBzZXQgdG8gaG9sZCBleGFjdGx5XG4gICAgICogb25lIG1lc3NhZ2UgaW4gdGhlIGJ1ZmZlciwgYW5kIHRoZSBsYXN0IG1lc3NhZ2UgY2F1c2luZyB0aGUgYmFja3ByZXNzdXJlXG4gICAgICogdG8ga2ljayBpbiBhbmQgdGhlIGNvbnN1bWVyIHRvIGJlIHBhdXNlZCBhbmQgdGhlbiByZXN1bWVkIGxhdGVyLlxuICAgICAqL1xuICAgIHZhciBzdHJlYW0gPSBuZXcgQ29uc3VtZXJTdHJlYW0oY29uc3VtZXJNb2NrLCB7IGhpZ2hXYXRlck1hcms6IDR9KTtcbiAgICBjb25zdW1lck1vY2suZW1pdCgnbWVzc2FnZScsIHsgZm9vOiAnYmFyJywgdG9waWM6ICdiYXonLCBwYXJ0aXRpb246IDEsIG9mZnNldDogMX0pO1xuICAgIGNvbnN1bWVyTW9jay5lbWl0KCdtZXNzYWdlJywgeyBmb286ICdiYXInLCB0b3BpYzogJ2JheicsIHBhcnRpdGlvbjogMSwgb2Zmc2V0OiAyfSk7XG4gICAgY29uc3VtZXJNb2NrLmVtaXQoJ21lc3NhZ2UnLCB7IGZvbzogJ2JhcicsIHRvcGljOiAnYmF6JywgcGFydGl0aW9uOiAxLCBvZmZzZXQ6IDN9KTtcbiAgICBjb25zdW1lck1vY2suZW1pdCgnbWVzc2FnZScsIHsgZm9vOiAnYmFyJywgdG9waWM6ICdiYXonLCBwYXJ0aXRpb246IDEsIG9mZnNldDogNH0pO1xuXG4gICAgdmFyIG1lc3NhZ2VzID0gW107XG4gICAgdmFyIGkgPSAyO1xuXG4gICAgd2hpbGUgKGkgPiAwKSB7XG4gICAgICBtZXNzYWdlcy5wdXNoKHN0cmVhbS5yZWFkKCkpO1xuICAgICAgaS0tO1xuICAgIH07XG5cbiAgICBwcm9jZXNzLm5leHRUaWNrKCgpID0+IHtcbiAgICAgIGV4cGVjdChtZXNzYWdlcy5sZW5ndGgpLnRvLmVxdWFsKDIpXG4gICAgICBleHBlY3QoY29uc3VtZXJNb2NrLnBhdXNlKS50by5oYXZlLmJlZW4uY2FsbGVkVHdpY2U7XG4gICAgICBleHBlY3Qoc3RyZWFtLnJlYWQoKS5vZmZzZXQpLnRvLmVxdWFsKDMpXG4gICAgICBkb25lKCk7XG4gICAgfSk7XG4gIH0pO1xufSk7XG4iXX0=
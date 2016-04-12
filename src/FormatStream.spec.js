var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

var stream = require('stream');


var FormatStream = require('./FormatStream');

describe('FormatStream', () => {

  describe('Constructor', () => {
    var data = { bar: 'qux' };
    var formatStub = sinon.stub();

    before(() => {
      sinon.stub(FormatStream, '_formatPayload', formatStub);
    })
    beforeEach(() => {
      FormatStream._formatPayload.reset();
      formatStub.reset();
    })
    after(() => FormatStream._formatPayload.restore())

    it('handles errors from formatPayload', done => {
      var format = new FormatStream(msg => 'foo');
      var error = new Error('foo');
      formatStub.throws(error);
      format.on('error', err => {
        expect(err).to.equal(error);
        done();
      })
      format.write(data);
    });
  });

  describe('_formatPayload', () => {
    var data = {
      foo: 'bar'
    };

    it('takes a function as a topic transformer', () => {
      var payload = FormatStream._formatPayload('foo', msg => 'bar');
      expect(payload[0].topic).to.equal('bar');
    });

    it('throws when given a bunk function', () => {
      var bunk = msg => null;
      expect(FormatStream._formatPayload.bind('foo', bunk))
        .to.throw(/topic transformation/);
    });

    it('makes messages into an Array', () => {
      var payload = FormatStream._formatPayload(data, 'baz');
      expect(payload).to.be.an('array');
      expect(payload[0].messages).to.be.an('array');
    });

    it('makes the topic whatever the topic should be', () => {
      var payload = FormatStream._formatPayload(data, 'baz');
      expect(payload[0].topic).to.equal('baz')
    });

    it('throws when not given a topic', () => {
      expect(FormatStream._formatPayload.bind(null, data)).to.throw()
    });

    it('works with arrays', () => {
      var arr = ['foo', 'bar']
      var payload = FormatStream._formatPayload(arr, 'baz');
      expect(JSON.parse(payload[0].messages[0])).to.equal('foo');
      expect(JSON.parse(payload[0].messages[1])).to.equal('bar');
    });

  });
});

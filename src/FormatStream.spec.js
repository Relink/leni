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
    // note: these are actually functional tests and test formatPayload
    // implicitely!! Should probably be changed.

    it('takes a string as a topic', () => {
      var format = new FormatStream('foo')
      format.write(data);
      expect(FormatStream._formatPayload).to.have.been.calledWith(data, 'foo')
    });

    it('takes a function as a topic transformer', () => {
      var format = new FormatStream(msg => 'foo');
      format.write(data);
      expect(FormatStream._formatPayload).to.have.been.calledWith(data, 'foo')
    });

    it('throws when given a bunk function', done => {
      var format = new FormatStream(msg => null);
      format.on('error', err => {
        expect(err).to.be.an.error;
        done();
      })
      format.write(data);
    });

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

    it('makes messages into a string', () => {
      var payload = FormatStream._formatPayload(data, 'baz');
      expect(payload).to.be.an('array')
      expect(payload[0].messages).to.be.a('string')
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
      expect(payload[0].messages).to.equal('foo');
    });

  });
});

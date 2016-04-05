var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var init = require('./init');

describe('init', () => {
  var e1;

  beforeEach(() =>{
    e1 = new EventEmitter();
  });

  describe('_initOnReady', () => {

    it('rejects the initial promise if emitter returns immediate error', done => {
      init._initOnReady(e1)
        .catch(err => {
          expect(err).to.be.an('error');
          expect(err.message).to.match(/bar/);
          done();
        })
      e1.emit('error', new Error('bar'))
    });

    it('Resolves to the producer when ready is emitted before any errors', done => {
      init._initOnReady(e1)
        .then(ee => {
          expect(ee).to.be.instanceof(EventEmitter);
          done();
        })
        .catch(err => done(err));

      e1.emit('ready');
      e1.emit('error', new Error('should not be caught'));
    });
  });
});

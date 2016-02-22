var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var EventEmitter = require('events').EventEmitter;
var init = require('./init');

describe('init', () => {
  describe('_initEmitters', () =>{
    var c1;
    var p1;
    var p2;

    beforeEach(() =>{
      p1 = new EventEmitter();
      p2 = new EventEmitter();
      c1 = new EventEmitter();
    });


    it('resolves to a stream that propogates messages', done => {
      init._initEmitters(p1, c1)
        .then(function (stream) {
          stream.on('message', function (message) {
            expect(message).to.equal('Hello how are you')
            done();
          })
        })

      p1.emit('ready');
      p2.emit('ready');
      setTimeout(() =>{
        c1.emit('message', "Hello how are you")
      }, 10);
    });

    it('resolves to a stream that propogates errors', function (done) {
      init._initEmitters(p1, c1)
        .then(function (stream) {
          stream.on('error', function (err) {
            expect(err).to.exist;
            done()
          })
        })

      p1.emit('ready');
      p2.emit('ready');
      setTimeout(() =>{
        c1.emit('error', new TypeError("hey"))
      }, 10);
    });

    it('rejects the initial promise if producers returns immediate errors',
       function (done) {
         init._initEmitters(p1, c1)
           .catch(function (err) {
             expect(err).to.exist;
             done();
           })

         p1.emit('error', new Error('bar'))
       });
  });
});

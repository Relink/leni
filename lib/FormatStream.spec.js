'use strict';

var chai = require('chai');
chai.use(require('sinon-chai'));
var expect = chai.expect;
var sinon = require('sinon');
var proxyquire = require('proxyquire');

var stream = require('stream');

var FormatStream = require('./FormatStream');

describe('FormatStream', function () {

  describe('Constructor', function () {
    var data = { bar: 'qux' };
    var formatStub = sinon.stub();

    before(function () {
      sinon.stub(FormatStream, '_formatPayload', formatStub);
    });
    beforeEach(function () {
      FormatStream._formatPayload.reset();
      formatStub.reset();
    });
    after(function () {
      return FormatStream._formatPayload.restore();
    });
    // note: these are actually functional tests and test formatPayload
    // implicitely!! Should probably be changed.

    it('takes a string as a topic', function () {
      var format = new FormatStream('foo');
      format.write(data);
      expect(FormatStream._formatPayload).to.have.been.calledWith(data, 'foo');
    });

    it('takes a function as a topic transformer', function () {
      var format = new FormatStream(function (msg) {
        return 'foo';
      });
      format.write(data);
      expect(FormatStream._formatPayload).to.have.been.calledWith(data, 'foo');
    });

    it('throws when given a bunk function', function (done) {
      var format = new FormatStream(function (msg) {
        return null;
      });
      format.on('error', function (err) {
        expect(err).to.be.an.error;
        done();
      });
      format.write(data);
    });

    it('handles errors from formatPayload', function (done) {
      var format = new FormatStream(function (msg) {
        return 'foo';
      });
      var error = new Error('foo');
      formatStub.throws(error);
      format.on('error', function (err) {
        expect(err).to.equal(error);
        done();
      });
      format.write(data);
    });
  });

  describe('_formatPayload', function () {
    var data = {
      foo: 'bar'
    };

    it('makes messages into a string', function () {
      var payload = FormatStream._formatPayload(data, 'baz');
      expect(payload).to.be.an('array');
      expect(payload[0].messages).to.be.a('string');
    });

    it('makes the topic whatever the topic should be', function () {
      var payload = FormatStream._formatPayload(data, 'baz');
      expect(payload[0].topic).to.equal('baz');
    });

    it('throws when not given a topic', function () {
      expect(FormatStream._formatPayload.bind(null, data)).to.throw();
    });

    it('works with arrays', function () {
      var arr = ['foo', 'bar'];
      var payload = FormatStream._formatPayload(arr, 'baz');
      expect(payload[0].messages).to.equal('foo');
    });
  });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Gb3JtYXRTdHJlYW0uc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLElBQUksT0FBTyxRQUFRLE1BQVIsQ0FBUDtBQUNKLEtBQUssR0FBTCxDQUFTLFFBQVEsWUFBUixDQUFUO0FBQ0EsSUFBSSxTQUFTLEtBQUssTUFBTDtBQUNiLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBUjtBQUNKLElBQUksYUFBYSxRQUFRLFlBQVIsQ0FBYjs7QUFFSixJQUFJLFNBQVMsUUFBUSxRQUFSLENBQVQ7O0FBR0osSUFBSSxlQUFlLFFBQVEsZ0JBQVIsQ0FBZjs7QUFFSixTQUFTLGNBQVQsRUFBeUIsWUFBTTs7QUFFN0IsV0FBUyxhQUFULEVBQXdCLFlBQU07QUFDNUIsUUFBSSxPQUFPLEVBQUUsS0FBSyxLQUFMLEVBQVQsQ0FEd0I7QUFFNUIsUUFBSSxhQUFhLE1BQU0sSUFBTixFQUFiLENBRndCOztBQUk1QixXQUFPLFlBQU07QUFDWCxZQUFNLElBQU4sQ0FBVyxZQUFYLEVBQXlCLGdCQUF6QixFQUEyQyxVQUEzQyxFQURXO0tBQU4sQ0FBUCxDQUo0QjtBQU81QixlQUFXLFlBQU07QUFDZixtQkFBYSxjQUFiLENBQTRCLEtBQTVCLEdBRGU7QUFFZixpQkFBVyxLQUFYLEdBRmU7S0FBTixDQUFYLENBUDRCO0FBVzVCLFVBQU07YUFBTSxhQUFhLGNBQWIsQ0FBNEIsT0FBNUI7S0FBTixDQUFOOzs7O0FBWDRCLE1BZTVCLENBQUcsMkJBQUgsRUFBZ0MsWUFBTTtBQUNwQyxVQUFJLFNBQVMsSUFBSSxZQUFKLENBQWlCLEtBQWpCLENBQVQsQ0FEZ0M7QUFFcEMsYUFBTyxLQUFQLENBQWEsSUFBYixFQUZvQztBQUdwQyxhQUFPLGFBQWEsY0FBYixDQUFQLENBQW9DLEVBQXBDLENBQXVDLElBQXZDLENBQTRDLElBQTVDLENBQWlELFVBQWpELENBQTRELElBQTVELEVBQWtFLEtBQWxFLEVBSG9DO0tBQU4sQ0FBaEMsQ0FmNEI7O0FBcUI1QixPQUFHLHlDQUFILEVBQThDLFlBQU07QUFDbEQsVUFBSSxTQUFTLElBQUksWUFBSixDQUFpQjtlQUFPO09BQVAsQ0FBMUIsQ0FEOEM7QUFFbEQsYUFBTyxLQUFQLENBQWEsSUFBYixFQUZrRDtBQUdsRCxhQUFPLGFBQWEsY0FBYixDQUFQLENBQW9DLEVBQXBDLENBQXVDLElBQXZDLENBQTRDLElBQTVDLENBQWlELFVBQWpELENBQTRELElBQTVELEVBQWtFLEtBQWxFLEVBSGtEO0tBQU4sQ0FBOUMsQ0FyQjRCOztBQTJCNUIsT0FBRyxtQ0FBSCxFQUF3QyxnQkFBUTtBQUM5QyxVQUFJLFNBQVMsSUFBSSxZQUFKLENBQWlCO2VBQU87T0FBUCxDQUExQixDQUQwQztBQUU5QyxhQUFPLEVBQVAsQ0FBVSxPQUFWLEVBQW1CLGVBQU87QUFDeEIsZUFBTyxHQUFQLEVBQVksRUFBWixDQUFlLEVBQWYsQ0FBa0IsRUFBbEIsQ0FBcUIsS0FBckIsQ0FEd0I7QUFFeEIsZUFGd0I7T0FBUCxDQUFuQixDQUY4QztBQU05QyxhQUFPLEtBQVAsQ0FBYSxJQUFiLEVBTjhDO0tBQVIsQ0FBeEMsQ0EzQjRCOztBQW9DNUIsT0FBRyxtQ0FBSCxFQUF3QyxnQkFBUTtBQUM5QyxVQUFJLFNBQVMsSUFBSSxZQUFKLENBQWlCO2VBQU87T0FBUCxDQUExQixDQUQwQztBQUU5QyxVQUFJLFFBQVEsSUFBSSxLQUFKLENBQVUsS0FBVixDQUFSLENBRjBDO0FBRzlDLGlCQUFXLE1BQVgsQ0FBa0IsS0FBbEIsRUFIOEM7QUFJOUMsYUFBTyxFQUFQLENBQVUsT0FBVixFQUFtQixlQUFPO0FBQ3hCLGVBQU8sR0FBUCxFQUFZLEVBQVosQ0FBZSxLQUFmLENBQXFCLEtBQXJCLEVBRHdCO0FBRXhCLGVBRndCO09BQVAsQ0FBbkIsQ0FKOEM7QUFROUMsYUFBTyxLQUFQLENBQWEsSUFBYixFQVI4QztLQUFSLENBQXhDLENBcEM0QjtHQUFOLENBQXhCLENBRjZCOztBQWtEN0IsV0FBUyxnQkFBVCxFQUEyQixZQUFNO0FBQy9CLFFBQUksT0FBTztBQUNULFdBQUssS0FBTDtLQURFLENBRDJCOztBQUsvQixPQUFHLDhCQUFILEVBQW1DLFlBQU07QUFDdkMsVUFBSSxVQUFVLGFBQWEsY0FBYixDQUE0QixJQUE1QixFQUFrQyxLQUFsQyxDQUFWLENBRG1DO0FBRXZDLGFBQU8sT0FBUCxFQUFnQixFQUFoQixDQUFtQixFQUFuQixDQUFzQixFQUF0QixDQUF5QixPQUF6QixFQUZ1QztBQUd2QyxhQUFPLFFBQVEsQ0FBUixFQUFXLFFBQVgsQ0FBUCxDQUE0QixFQUE1QixDQUErQixFQUEvQixDQUFrQyxDQUFsQyxDQUFvQyxRQUFwQyxFQUh1QztLQUFOLENBQW5DLENBTCtCOztBQVcvQixPQUFHLDhDQUFILEVBQW1ELFlBQU07QUFDdkQsVUFBSSxVQUFVLGFBQWEsY0FBYixDQUE0QixJQUE1QixFQUFrQyxLQUFsQyxDQUFWLENBRG1EO0FBRXZELGFBQU8sUUFBUSxDQUFSLEVBQVcsS0FBWCxDQUFQLENBQXlCLEVBQXpCLENBQTRCLEtBQTVCLENBQWtDLEtBQWxDLEVBRnVEO0tBQU4sQ0FBbkQsQ0FYK0I7O0FBZ0IvQixPQUFHLCtCQUFILEVBQW9DLFlBQU07QUFDeEMsYUFBTyxhQUFhLGNBQWIsQ0FBNEIsSUFBNUIsQ0FBaUMsSUFBakMsRUFBdUMsSUFBdkMsQ0FBUCxFQUFxRCxFQUFyRCxDQUF3RCxLQUF4RCxHQUR3QztLQUFOLENBQXBDLENBaEIrQjs7QUFvQi9CLE9BQUcsbUJBQUgsRUFBd0IsWUFBTTtBQUM1QixVQUFJLE1BQU0sQ0FBQyxLQUFELEVBQVEsS0FBUixDQUFOLENBRHdCO0FBRTVCLFVBQUksVUFBVSxhQUFhLGNBQWIsQ0FBNEIsR0FBNUIsRUFBaUMsS0FBakMsQ0FBVixDQUZ3QjtBQUc1QixhQUFPLFFBQVEsQ0FBUixFQUFXLFFBQVgsQ0FBUCxDQUE0QixFQUE1QixDQUErQixLQUEvQixDQUFxQyxLQUFyQyxFQUg0QjtLQUFOLENBQXhCLENBcEIrQjtHQUFOLENBQTNCLENBbEQ2QjtDQUFOLENBQXpCIiwiZmlsZSI6IkZvcm1hdFN0cmVhbS5zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNoYWkgPSByZXF1aXJlKCdjaGFpJyk7XG5jaGFpLnVzZShyZXF1aXJlKCdzaW5vbi1jaGFpJykpO1xudmFyIGV4cGVjdCA9IGNoYWkuZXhwZWN0O1xudmFyIHNpbm9uID0gcmVxdWlyZSgnc2lub24nKTtcbnZhciBwcm94eXF1aXJlID0gcmVxdWlyZSgncHJveHlxdWlyZScpO1xuXG52YXIgc3RyZWFtID0gcmVxdWlyZSgnc3RyZWFtJyk7XG5cblxudmFyIEZvcm1hdFN0cmVhbSA9IHJlcXVpcmUoJy4vRm9ybWF0U3RyZWFtJyk7XG5cbmRlc2NyaWJlKCdGb3JtYXRTdHJlYW0nLCAoKSA9PiB7XG5cbiAgZGVzY3JpYmUoJ0NvbnN0cnVjdG9yJywgKCkgPT4ge1xuICAgIHZhciBkYXRhID0geyBiYXI6ICdxdXgnIH07XG4gICAgdmFyIGZvcm1hdFN0dWIgPSBzaW5vbi5zdHViKCk7XG5cbiAgICBiZWZvcmUoKCkgPT4ge1xuICAgICAgc2lub24uc3R1YihGb3JtYXRTdHJlYW0sICdfZm9ybWF0UGF5bG9hZCcsIGZvcm1hdFN0dWIpO1xuICAgIH0pXG4gICAgYmVmb3JlRWFjaCgoKSA9PiB7XG4gICAgICBGb3JtYXRTdHJlYW0uX2Zvcm1hdFBheWxvYWQucmVzZXQoKTtcbiAgICAgIGZvcm1hdFN0dWIucmVzZXQoKTtcbiAgICB9KVxuICAgIGFmdGVyKCgpID0+IEZvcm1hdFN0cmVhbS5fZm9ybWF0UGF5bG9hZC5yZXN0b3JlKCkpXG4gICAgLy8gbm90ZTogdGhlc2UgYXJlIGFjdHVhbGx5IGZ1bmN0aW9uYWwgdGVzdHMgYW5kIHRlc3QgZm9ybWF0UGF5bG9hZFxuICAgIC8vIGltcGxpY2l0ZWx5ISEgU2hvdWxkIHByb2JhYmx5IGJlIGNoYW5nZWQuXG5cbiAgICBpdCgndGFrZXMgYSBzdHJpbmcgYXMgYSB0b3BpYycsICgpID0+IHtcbiAgICAgIHZhciBmb3JtYXQgPSBuZXcgRm9ybWF0U3RyZWFtKCdmb28nKVxuICAgICAgZm9ybWF0LndyaXRlKGRhdGEpO1xuICAgICAgZXhwZWN0KEZvcm1hdFN0cmVhbS5fZm9ybWF0UGF5bG9hZCkudG8uaGF2ZS5iZWVuLmNhbGxlZFdpdGgoZGF0YSwgJ2ZvbycpXG4gICAgfSk7XG5cbiAgICBpdCgndGFrZXMgYSBmdW5jdGlvbiBhcyBhIHRvcGljIHRyYW5zZm9ybWVyJywgKCkgPT4ge1xuICAgICAgdmFyIGZvcm1hdCA9IG5ldyBGb3JtYXRTdHJlYW0obXNnID0+ICdmb28nKTtcbiAgICAgIGZvcm1hdC53cml0ZShkYXRhKTtcbiAgICAgIGV4cGVjdChGb3JtYXRTdHJlYW0uX2Zvcm1hdFBheWxvYWQpLnRvLmhhdmUuYmVlbi5jYWxsZWRXaXRoKGRhdGEsICdmb28nKVxuICAgIH0pO1xuXG4gICAgaXQoJ3Rocm93cyB3aGVuIGdpdmVuIGEgYnVuayBmdW5jdGlvbicsIGRvbmUgPT4ge1xuICAgICAgdmFyIGZvcm1hdCA9IG5ldyBGb3JtYXRTdHJlYW0obXNnID0+IG51bGwpO1xuICAgICAgZm9ybWF0Lm9uKCdlcnJvcicsIGVyciA9PiB7XG4gICAgICAgIGV4cGVjdChlcnIpLnRvLmJlLmFuLmVycm9yO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9KVxuICAgICAgZm9ybWF0LndyaXRlKGRhdGEpO1xuICAgIH0pO1xuXG4gICAgaXQoJ2hhbmRsZXMgZXJyb3JzIGZyb20gZm9ybWF0UGF5bG9hZCcsIGRvbmUgPT4ge1xuICAgICAgdmFyIGZvcm1hdCA9IG5ldyBGb3JtYXRTdHJlYW0obXNnID0+ICdmb28nKTtcbiAgICAgIHZhciBlcnJvciA9IG5ldyBFcnJvcignZm9vJyk7XG4gICAgICBmb3JtYXRTdHViLnRocm93cyhlcnJvcik7XG4gICAgICBmb3JtYXQub24oJ2Vycm9yJywgZXJyID0+IHtcbiAgICAgICAgZXhwZWN0KGVycikudG8uZXF1YWwoZXJyb3IpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9KVxuICAgICAgZm9ybWF0LndyaXRlKGRhdGEpO1xuICAgIH0pO1xuICB9KTtcblxuICBkZXNjcmliZSgnX2Zvcm1hdFBheWxvYWQnLCAoKSA9PiB7XG4gICAgdmFyIGRhdGEgPSB7XG4gICAgICBmb286ICdiYXInXG4gICAgfTtcblxuICAgIGl0KCdtYWtlcyBtZXNzYWdlcyBpbnRvIGEgc3RyaW5nJywgKCkgPT4ge1xuICAgICAgdmFyIHBheWxvYWQgPSBGb3JtYXRTdHJlYW0uX2Zvcm1hdFBheWxvYWQoZGF0YSwgJ2JheicpO1xuICAgICAgZXhwZWN0KHBheWxvYWQpLnRvLmJlLmFuKCdhcnJheScpXG4gICAgICBleHBlY3QocGF5bG9hZFswXS5tZXNzYWdlcykudG8uYmUuYSgnc3RyaW5nJylcbiAgICB9KTtcblxuICAgIGl0KCdtYWtlcyB0aGUgdG9waWMgd2hhdGV2ZXIgdGhlIHRvcGljIHNob3VsZCBiZScsICgpID0+IHtcbiAgICAgIHZhciBwYXlsb2FkID0gRm9ybWF0U3RyZWFtLl9mb3JtYXRQYXlsb2FkKGRhdGEsICdiYXonKTtcbiAgICAgIGV4cGVjdChwYXlsb2FkWzBdLnRvcGljKS50by5lcXVhbCgnYmF6JylcbiAgICB9KTtcblxuICAgIGl0KCd0aHJvd3Mgd2hlbiBub3QgZ2l2ZW4gYSB0b3BpYycsICgpID0+IHtcbiAgICAgIGV4cGVjdChGb3JtYXRTdHJlYW0uX2Zvcm1hdFBheWxvYWQuYmluZChudWxsLCBkYXRhKSkudG8udGhyb3coKVxuICAgIH0pO1xuXG4gICAgaXQoJ3dvcmtzIHdpdGggYXJyYXlzJywgKCkgPT4ge1xuICAgICAgdmFyIGFyciA9IFsnZm9vJywgJ2JhciddXG4gICAgICB2YXIgcGF5bG9hZCA9IEZvcm1hdFN0cmVhbS5fZm9ybWF0UGF5bG9hZChhcnIsICdiYXonKTtcbiAgICAgIGV4cGVjdChwYXlsb2FkWzBdLm1lc3NhZ2VzKS50by5lcXVhbCgnZm9vJyk7XG4gICAgfSk7XG5cbiAgfSk7XG59KTtcbiJdfQ==
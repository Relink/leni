var ConsumerStream = require('./ConsumerStream');

var kafka = require('kafka-node')
var client = new kafka.Client();
var consumer = new kafka.HighLevelConsumer(client, [{ topic: 'foo'}]);
var stream = new ConsumerStream(consumer);
var i = 4;

// consumer.fetch();
// console.log('is paused', consumer.paused);
// consumer.pause();
// setTimeout(() => consumer.resume(), 5000);
// console.log('is paused', consumer.paused);
// consumer.on('message', msg => {
  // console.log('recieved message!', msg)
// })

// console.log('is paused', consumer.paused)
function readThatShit() {
  console.log('is paused (fn level)', consumer.paused);
  i = 4;
  stream.resume();
}

// stream.on('readable', () => {
//   console.log('is paused', consumer.paused);
//   console.log('i: ', i)

//   if (i > 0) {
//     i--;
//     var chunk = stream.read();
//     console.log('got chunk', chunk);
//   }
//   else {
//     setTimeout(() => {
//       console.log('timeout')
//       readThatShit();
//     }, 10000);
//   }
// });


stream.on('data', msg => {
  i--;
  console.log('on data', msg.value);
  if (i > 0) {
    //something
  }
  else {
    stream.pause();
    console.log('timeout');
    setTimeout(() => {
      console.log('-----------timeout out')
      readThatShit();
    }, 10000)
  }
})

readThatShit();


 // stream.on('data', msg => {
  // console.log('data event', msg);
// })

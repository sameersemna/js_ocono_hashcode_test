process.on('SIGINT', function() {
    console.log('Naughty SIGINT-handler');
});
process.on('exit', function () {
    console.log('exit');
});
console.log('PID: ', process.pid);
process.on('SIGINT', function() {
    console.log('Nice SIGINT-handler');
    var listeners = process.listeners('SIGINT');
    for (var i = 0; i < listeners.length; i++) {
        console.log(listeners[i].toString());
    }

    process.exit();
});

var dataSet = 'example';
process.argv.forEach(function (val, index, array) {
  // console.log(index + ': ' + val);
  if(index === 2){
    dataSet = val;
  }
});

console.log('Start...');

var config = require('./config');
var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var Pizza = require('./Pizza');
var Report = require('./Report');

var instream = fs.createReadStream(config.files[dataSet]);
var outstream = new stream;
var rlDataset = readline.createInterface(instream, outstream);

var pizzaConfig = {
  settings: null,
  arr: []
};
var slices = [];

rlDataset.on('line', function(line) {
  if (!pizzaConfig.settings) {
    var settings = line.split(' ');
    pizzaConfig.settings = {
      rows: parseInt(settings[0]),
      columns: parseInt(settings[1]),
      ips: parseInt(settings[2]), // ingredients per slice min
      cps: parseInt(settings[3]), // cells per slice max
    };
  } else {
    pizzaConfig.arr.push(line.split(''));
  }
});

rlDataset.on('close', function() {
  console.log('pizzaConfig.settings:', pizzaConfig.settings);
  //console.log('pizzaConfig.arr: \n', pizzaConfig.arr);
  var pizza = new Pizza(pizzaConfig);
  pizza.SliceIt();
  Report.generate(pizza, dataSet);
});

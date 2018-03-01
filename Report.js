var config = require('./config');
var fs = require('fs');

class Report {
  static generate(pizza, dataSet){
    var currTime = new Date().getTime();
    var fileName = `${config.reportFolder}/${dataSet}_${currTime}.txt`;
    var logger = fs.createWriteStream(fileName, {
      flags: 'a' // 'a' means appending (old data will be preserved)
    })

    logger.write(pizza.slices.length + '\n');
    pizza.slices.forEach((slice) => {
      var coord = slice.getCoordinates();
      //console.dir(coord);
      logger.write(`${coord.tl.r} ${coord.tl.c} ${coord.br.r} ${coord.br.c}\n`);
    });
  };
}

module.exports = Report;

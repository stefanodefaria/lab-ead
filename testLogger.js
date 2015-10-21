module.exports.createLog = function(filename) {
  var stream = require('fs').createWriteStream('./res/' + filename + '.log');

  return {
    log: function(string){
      stream.write(string);
    }
  }
};

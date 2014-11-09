var winston = require('winston');
var path = require('path');
var ENV = process.env.NODE_ENV;

// can be much more flexible than that O_o
function getLogger(module) {

 //console.log(path);
   
  var cpath = module.filename.split(path.sep).slice(-2).join(path.sep);

  return new winston.Logger({
    transports: [
      new winston.transports.Console({
        colorize: true,
        level: (ENV == 'development') ? 'debug' : 'error',
        label: cpath
      })
    ]
  });
}
module.exports = getLogger;
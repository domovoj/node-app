var nconf = require('nconf');
var path = require('path');

process.env.NODE_ENV = 'development';

nconf.argv()
       .env()
       .file({ file: path.join(__dirname, 'config.json')});

module.exports = nconf;
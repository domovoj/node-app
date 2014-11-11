var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./libs/log')(module);
var HttpError = require('./error').HttpError;

var app = express();
app.engine('ejs', require('ejs-locals')); //engine - розширення, озн: якою залежністю обрабляти файли з розширенням 'ejs'
app.set('views', path.join(__dirname, '/templates'));
app.set('view engine', 'ejs');

app.use(express.favicon());

if (app.get('env') === 'development')
    app.use(express.logger('dev'));
else
    app.use(express.logger('default'));

var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cookieParser());

app.use(require('./middleware/sendHttpError'));

app.use(app.router);

require('./routes')(app);

app.use(express.static(path.join(__dirname, 'public')));

app.use(function(err, req, res, next) {
  if (typeof err == 'number') { // next(404);
    err = new HttpError(err);
  }

  if (err instanceof HttpError) {
    res.sendHttpError(err);
  } else {
    if (app.get('env') == 'development') {
      express.errorHandler()(err, req, res, next);
    } else {
      log.error(err);
      err = new HttpError(500);
      res.sendHttpError(err);
    }
  }
});

http.createServer(app).listen(config.get('port'), function () {
    log.info('Express server litening on port ' + config.get('port'));
});
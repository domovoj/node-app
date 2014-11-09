var express = require('express');
var http = require('http');
var path = require('path');
var config = require('./config');
var log = require('./libs/log')(module);

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
app.use(app.router);

app.get('/', function (req, res, next) {
    res.render('index', {
    });
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(function (err, req, res, next) {
    //NODE_ENV
    if (app.get('env') === 'development') {
        var errorHandler = express.errorHandler();
        errorHandler(err, req, res, next);
    }
    else
        res.send(500);
});


//var routes = require('./routes');
//var user = require('./routes/user');

// all environments
/*
// development only

app.get('/', routes.index);
app.get('/users', user.list);
*/

http.createServer(app).listen(config.get('port'), function () {
    log.info('Express server litening on port ' + config.get('port'));
});
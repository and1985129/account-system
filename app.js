var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var session = require('express-session');
var flash = require('connect-flash');
var MongoStore = require('connect-mongo')(session);
var settings = require('./settings');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: settings.cookieSecret
  //store: new MongoStore({
  //  db: settings.db
  //  })
//saveUninitialized: false, // don’t create session until something stored
//resave: false, //don’t save session if unmodified
//  store: new MongoStore({
//    url: 'mongodb://localhost/session',
//    autoRemove: 'interval',
//    autoRemoveInterval: 10 // In minutes. Default
//  })
  })
);
app.use(flash());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var url = req.originalUrl;
  console.log("访问地址: " + url);

  // 简单的地址拦截器
  if ((url == '/month' || url == '/stat' || url == '/list' || url == '/record') && !req.session.user) {
    req.flash('error', '请先登录');
    return res.redirect('/login');
  }

  res.locals.user = req.session.user;
  var error = req.flash('error');
  res.locals.error = error.length?error:null;

  var success = req.flash('success');
  res.locals.success = success.length?success:null;

  res.locals.session = req.session;

  next();
});

app.use('/', routes);

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    console.log(err);
    console.log(err.message);
    res.status(err.status || 500);
    res.render('error', {
      title: '错误',
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: '错误',
    error: err.message
  });
});

module.exports = app;

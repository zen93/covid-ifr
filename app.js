var createError = require('http-errors');
var express = require('express');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
var rateLimit = require('express-rate-limit');

var indexRouter = require('./routes');

var app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1250,
  message:
    "Too many requests from this IP, please try again after 15 minutes"
});

app.use(limiter);
app.use(cors());
app.options('*', cors()); //Allow all origins
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err.stack);
  res.send('Error! ' + res.locals.error);
});

module.exports = app;

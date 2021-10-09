var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var dotenv = require("dotenv");
dotenv.config();

//--------route declarations------//
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var pagePlacesRouter = require('./routes/page_places');
var publicContentsRouter = require('./routes/public_contents');
var publicContentTranslationsRouter = require('./routes/public_content_translations');
var languagesRouter = require('./routes/languages');
var languageTranslationsRouter = require('./routes/language_translations');
var authenticationRouter = require('./routes/authentication');
//--------------------------------//

var app = express();

var cors = require('cors');
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// //--------routes------------//
app.use('/api/pagePlaces', pagePlacesRouter);
app.use('/api/users', usersRouter);
app.use('/api/publicContents', publicContentsRouter);
app.use('/api/publicContentTranslations', publicContentTranslationsRouter);
app.use('/api/languages', languagesRouter);
app.use('/api/languageTranslations', languageTranslationsRouter);
app.use('/api/auth', authenticationRouter);
// //---------------------------//

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
  res.render('error');
});

module.exports = app;

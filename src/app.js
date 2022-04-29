const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
// const sassMiddleware = require('node-sass-middleware');
const multipartMiddleware = require('connect-multiparty')();
const flash = require('connect-flash')()
const session = require('express-session')


const indexRouter = require('./routes/index.route');
const apiRouter = require('./routes/api.route');
const loginRouter = require('./routes/login.route');
const registrationRouter = require('./routes/registration.route');
const dashboardRouter = require('./routes/dashboard.route')

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({ cookie: { maxAge: 1440000 },
  secret: '$uper$ecretKey',
  resave: false,
  saveUninitialized: false}));
app.use(flash)
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(sassMiddleware({
//   src: path.join(__dirname, 'public'),
//   dest: path.join(__dirname, 'public'),
//   indentedSyntax: false, // true = .sass and false = .scss
//   sourceMap: true
// }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(multipartMiddleware);


app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/login', loginRouter);
app.use('/registration', registrationRouter);
app.use('/dashboard', dashboardRouter);
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

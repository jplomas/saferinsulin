/* eslint no-console: 0, quotes: 0 */

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var calc = require('insulin-calc');
var compression = require('compression');
var helmet = require('helmet');

var indexRouter = require('./routes/index');
var startInsulinRouter = require('./routes/start');
var continueInsulinRouter = require('./routes/continue');
var checkRouter = require('./routes/check');

var app = express();

// Set Content Security Policies
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      'script-src': ["'self'", "'unsafe-eval'"],
    },
  }),
);

app.use(compression());

// tests
console.log('Self-test in progress...');
var passed = 0;
var r = calc.ongoingRate();
if (r === false) {
  console.log('   ... Test 1 passed');
  passed += 1;
}
r = calc.ongoingRate(10, 10);
if (r === false) {
  console.log('   ... Test 2 passed');
  passed += 1;
}
r = calc.ongoingRate(10);
if (r === false) {
  console.log('   ... Test 3 passed');
  passed += 1;
}
r = calc.ongoingRate(NaN, NaN, NaN);
if (r === false) {
  console.log('   ... Test 4 passed');
  passed += 1;
}
r = calc.ongoingRate(NaN, 8, NaN);
if (r === false) {
  console.log('   ... Test 5 passed');
  passed += 1;
}
r = calc.ongoingRate(NaN, 8, 1);
if (r === false) {
  console.log('   ... Test 6 passed');
  passed += 1;
}
r = calc.ongoingRate(1.3, 12.1, 1.0);
if (r.rateNum === 0) {
  console.log('   ... Test 7 passed');
  passed += 1;
}
r = calc.ongoingRate(2.4, 12.1, 1.0);
if (r.rateNum === 0) {
  console.log('   ... Test 8 passed');
  passed += 1;
}
r = calc.ongoingRate(8.6, 8.9, 1.0);
if (r.rateNum === 1) {
  console.log('   ... Test 9 passed');
  passed += 1;
}
r = calc.ongoingRate(8, 11, 5);
if (r.rateNum === 3.6) {
  console.log('   ... Test 10 passed');
  passed += 1;
}
r = calc.ongoingRate(8.2, 20, 1);
if (r.rateNum === 0.4) {
  console.log('   ... Test 11 passed');
  passed += 1;
}
r = calc.ongoingRate(16, 11.5, 2);
if (r.rateNum === 4.8) {
  console.log('   ... Test 12 passed');
  passed += 1;
}
r = calc.ongoingRate(11, 10.9, 1);
if (r.rateNum === 2) {
  passed += 1;
  console.log('   ... Test 13 passed');
}
r = calc.ongoingRate(10.5, 12.7, 1);
if (r.rateNum === 0.8) {
  passed += 1;
  console.log('   ... Test 14 passed');
}
r = calc.ongoingRate(11.1, 11.4, 2.2);
if (r.rateNum === 2.2) {
  passed += 1;
  console.log('   ... Test 15 passed');
}
r = calc.ongoingRate(13, 10, 2);
if (r.rateNum === 4) {
  passed += 1;
  console.log('   ... Test 16 passed');
}
r = calc.ongoingRate(13, 12.9, 2);
if (r.rateNum === 3) {
  passed += 1;
  console.log('   ... Test 17 passed');
}
r = calc.ongoingRate(12.5, 13, 2);
if (r.rateNum === 3) {
  passed += 1;
  console.log('   ... Test 18 passed');
}
r = calc.ongoingRate(11.7, 12.7, 2.2);
if (r.rateNum === 2.2) {
  passed += 1;
  console.log('   ... Test 19 passed');
}
r = calc.ongoingRate(5.2, 5, 2.2);
if (r.rateNum === 0) {
  passed += 1;
  console.log('   ... Test 20 passed');
}
r = calc.ongoingRate(6.2, 8.1, 2.2);
if (r.rateNum === 1.1) {
  passed += 1;
  console.log('   ... Test 21 passed');
}
r = calc.ongoingRate(7.1, 7.1, 2.2);
if (r.rateNum === 1.1) {
  passed += 1;
  console.log('   ... Test 22 passed');
}
r = calc.ongoingRate(5.1, 6.8, 1.1);
if (r.rateNum === 0) {
  passed += 1;
  console.log('   ... Test 23 passed');
}
r = calc.ongoingRate(13.1, 24, 2.0);
if (r.rateNum === 1.1) {
  passed += 1;
  console.log('   ... Test 24 passed');
}
r = calc.ongoingRate(5.8, 7, 2.0);
if (r.rateNum === 0) {
  passed += 1;
  console.log('   ... Test 25 passed');
}
r = calc.ongoingRate(7, 3.1, 0);
if (r.rateNum === 0) {
  passed += 1;
  console.log('   ... Test 26 passed');
}
r = calc.ongoingRate(7, 3.1, 0.1);
if (r.rateNum === 0) {
  passed += 1;
  console.log('   ... Test 27 passed');
}
r = calc.ongoingRate(13, 15, 2);
if (r.rateNum === 2) {
  passed += 1;
  console.log('   ... Test 28 passed');
}
r = calc.ongoingRate(14.2, 17, 3);
if (r.rateNum === 3) {
  passed += 1;
  console.log('   ... Test 29 passed');
}
r = calc.ongoingRate(14.2, 27, 3);
if (r.rateNum === 1.6) {
  passed += 1;
  console.log('   ... Test 30 passed');
}
r = calc.ongoingRate(12.3, 17.5, 2);
if (r.rateNum === 1.4) {
  passed += 1;
  console.log('   ... Test 31 passed');
}
r = calc.ongoingRate(15, 13, 2);
if (r.rateNum === 4) {
  passed += 1;
  console.log('   ... Test 32 passed');
}
r = calc.ongoingRate(16, 15, 3);
if (r.rateNum === 5.1) {
  passed += 1;
  console.log('   ... Test 33 passed');
}
r = calc.ongoingRate(17.1, 17.1, 19);
if (r.rateNum === 18) {
  passed += 1;
  console.log('   ... Test 34 passed');
}
r = calc.ongoingRate(NaN, NaN, NaN);
if (r === false) {
  passed += 1;
  console.log('   ... Test 35 passed');
}
r = calc.createGovernance({ f: 'x' });
if (r === false) {
  passed += 1;
  console.log('   ... Test 36 passed');
}
r = calc.startingRate(30);
if (r.rateNum === 4) {
  passed += 1;
  console.log('   ... Test 37 passed');
}
r = calc.startingRate(11.2);
if (r.rateNum === 1) {
  passed += 1;
  console.log('   ... Test 38 passed');
}
r = calc.startingRate(14.5);
if (r.rateNum === 2) {
  passed += 1;
  console.log('   ... Test 39 passed');
}
r = calc.startingRate(15.6);
if (r.rateNum === 3) {
  passed += 1;
  console.log('   ... Test 40 passed');
}
r = calc.startingRate(6.4);
if (r.rate === 'N/A') {
  passed += 1;
  console.log('   ... Test 41 passed');
}
r = calc.startingRate(60);
if (r.rateNum === 4) {
  passed += 1;
  console.log('   ... Test 42 passed');
}
r = calc.startingRate();
if (r.rate === '') {
  passed += 1;
  console.log('   ... Test 43 passed');
}
r = calc.startingRate('NULL');
if (r.rate === '') {
  passed += 1;
  console.log('   ... Test 44 passed');
}
r = calc.startingRate(-10.2);
if (r.rate === '') {
  passed += 1;
  console.log('   ... Test 45 passed');
}
r = calc.governance();
if (r === null) {
  passed += 1;
  console.log('   ... Test 46 passed');
}
r = calc.governance('A2-BBC43-AEFF');
if (r === null) {
  passed += 1;
  console.log('   ... Test 47 passed');
}
r = calc.governance('9403b059-b81c6b');
var d = r.date.substring(0, 33);
if (r.function === 'b') {
  passed += 1;
  console.log('   ... Test 48a passed');
}
if (r.current === 5.9) {
  passed += 1;
  console.log('   ... Test 48b passed');
}
if (r.last === 8.9) {
  passed += 1;
  console.log('   ... Test 48c passed');
}
if (r.rate === 14.8) {
  passed += 1;
  console.log('   ... Test 48d passed');
}
if (d === 'Fri Nov 01 2019 13:21:00 GMT+0000') {
  passed += 1;
  console.log('   ... Test 48e passed');
}
r = calc.governance('0bc-a81c71');
d = r.date.substring(0, 33);
if (r.function === 'a') {
  passed += 1;
  console.log('   ... Test 49a passed');
}
if (r.current === 18.8) {
  passed += 1;
  console.log('   ... Test 49b passed');
}
if (r.last === null) {
  passed += 1;
  console.log('   ... Test 49c passed');
}
if (r.rate === null) {
  passed += 1;
  console.log('   ... Test 49d passed');
}
if (d === 'Fri Nov 01 2019 13:27:00 GMT+0000') {
  passed += 1;
  console.log('   ... Test 49e passed');
}

console.log(`Self-test: ${passed}/57 tests passed`);
if (passed !== 57) {
  console.log('*** SELF-TEST FAIL: API CANNOT START ***');
  process.exit(1);
}

console.log('All tests passed: starting API');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/', indexRouter);
app.use('/v1/start', startInsulinRouter);
app.use('/v1/continue', continueInsulinRouter);
app.use('/v1/check', checkRouter);

// catch 404 and forward to error handler
app.use(function (req, res) {
  res.statusCode = 400;
  res.statusMessage = 'InvalidApiCall';
  res.send();
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

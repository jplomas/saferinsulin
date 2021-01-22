var express = require('express');
var calc = require('insulin-calc/js/insulin-calc');

var router = express.Router();

/* GET users listing. */
router.get('/current/:current/previous/:previous/rate/:rate/', function (req, res, next) {
  var { current, previous, rate } = req.params;
  var result = calc.ongoingRate(current, previous, rate);
  res.send(result);
});

module.exports = router;

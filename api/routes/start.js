var express = require('express');
var calc = require('insulin-calc/js/insulin-calc');

var router = express.Router();

/* GET users listing. */
router.get('/:bm', function (req, res, next) {
  var glucose = parseFloat(req.params.bm);
  // var glucose = 13.2;
  var result = calc.startingRate(glucose);
  res.send(result);
});

module.exports = router;

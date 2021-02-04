var express = require('express');
var calc = require('insulin-calc');

var router = express.Router();

/**
 * @api {get} /start/glucose/:glucose Starting insulin infusion
 * @apiName GetStart
 * @apiGroup GET
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} glucose Current blood glucose reading (mmol/L)
 *
 * @apiSuccess {String} rate Rate to set insulin (including units ml/hr).
 * @apiSuccess {Number} rateNum Rate as Number (Float)
 * @apiSuccess {Object} advice Advice
 * @apiSuccess {String} advice.type Type of advice
 * @apiSuccess {String[]} advice.text Line by line advice text
 * @apiSuccess {String} hex Governance hexcode
 */
router.get('/glucose/:glucose', function (req, res, next) {
  var glucose = parseFloat(req.params.glucose);
  // var glucose = 13.2;
  var result = calc.startingRate(glucose);
  res.send(result);
});

module.exports = router;

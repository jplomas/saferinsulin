var express = require('express');
var calc = require('insulin-calc');

var router = express.Router();

/**
 * @api {get} /continue/glucose/:glucose/previous/:previous/rate/:rate Continuing an insulin infusion
 * @apiName GetContinue
 * @apiGroup GET
 * @apiVersion 1.0.0
 *
 * @apiParam {Number} glucose Current blood glucose reading (mmol/L)
 * @apiParam {Number} previous Previous blood glucose reading (mmol/L)
 * @apiParam {Number} rate Current fast-acting insulin rate (ml/hr)
 *
 * @apiSuccess {String} rate Rate to set insulin (including units ml/hr).
 * @apiSuccess {Number} rateNum Rate as Number (Float)
 * @apiSuccess {Object} advice Advice
 * @apiSuccess {String} advice.type Type of advice
 * @apiSuccess {String[]} advice.text Line by line advice text
 * @apiSuccess {String} hex Governance hexcode
 */
router.get('/glucose/:glucose/previous/:previous/rate/:rate', function (req, res, next) {
    var { glucose, previous, rate } = req.params;
  var result = calc.ongoingRate(glucose, previous, rate);
  if (result) {
    res.send(result);
  } else {
    res.send({error: 'Invalid parameters'})
  }
});

module.exports = router;

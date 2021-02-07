/* eslint no-console:0 */
var express = require('express');
var calc = require('insulin-calc');

var router = express.Router();

/**
 * @api {get} /v1/continue/glucose/:glucose/previous/:previous/rate/:rate Continuing an insulin infusion
 * @apiName GetContinue
 * @apiGroup GET
 * @apiVersion 1.2.3
 *
 * @apiParam {Number} glucose Current blood glucose reading (mmol/L)
 * @apiParam {Number} previous Previous blood glucose reading (mmol/L)
 * @apiParam {Number} rate Current fast-acting insulin rate (ml/hr)
 *
 * @apiSuccess {String} rate Rate to set insulin (including units/hr).
 * @apiSuccess {Number} rateNum Rate as Number (Float)
 * @apiSuccess {Object} advice Advice
 * @apiSuccess {String} advice.type Type of advice
 * @apiSuccess {String[]} advice.text Line by line advice text
 * @apiSuccess {String} hex Governance hexcode
 */
router.get('/glucose/:glucose?/previous/:previous?/rate/:rate?', function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('======================================================');
  console.log({ ip: ip, request: req.params });
  var { glucose, previous, rate } = req.params;
  var result = calc.ongoingRate(glucose, previous, rate);
  if (result) {
    res.send(result);
  } else {
    res.statusCode = 400;
    res.statusMessage = 'InvalidParameters';
    res.send();
  }
});

/**
 * @api {post} /v1/continue Continuing an insulin infusion
 * @apiName PostContinue
 * @apiGroup POST
 * @apiVersion 1.2.3
 *
 * @apiParam {Number} glucose Current blood glucose reading (mmol/L)
 * @apiParam {Number} previous Previous blood glucose reading (mmol/L)
 * @apiParam {Number} rate Current fast-acting insulin rate (ml/hr)
 *
 * @apiSuccess {String} rate Rate to set insulin (including units/hr).
 * @apiSuccess {Number} rateNum Rate as Number (Float)
 * @apiSuccess {Object} advice Advice
 * @apiSuccess {String} advice.type Type of advice
 * @apiSuccess {String[]} advice.text Line by line advice text
 * @apiSuccess {String} hex Governance hexcode
 */
router.post('/', function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('======================================================');
  console.log({ ip: ip, request: req.body });
  var { glucose, previous, rate } = req.body;
  var result = calc.ongoingRate(glucose, previous, rate);
  if (result) {
    res.send(result);
  } else {
    res.statusCode = 400;
    res.statusMessage = 'InvalidParameters';
    res.send();
  }
});

module.exports = router;

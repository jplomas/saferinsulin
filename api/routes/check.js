/* eslint no-console: 0 */
var express = require('express');
var calc = require('insulin-calc');

var router = express.Router();

/**
 * @api {get} /check/:governance Governance hexcode check
 * @apiName GetCheck
 * @apiGroup GET
 * @apiVersion 1.2.3
 *
 * @apiParam {String} governance Governance hexcode generated by the saferinsulin.org algorithm
 *
 * @apiSuccess {String} function Calculator function called: 'a' (start) or 'b' (continue).
 * @apiSuccess {Number} current Current glucose parameter passed to function
 * @apiSuccess {Number} last Previous glucose parameter passed to function [b only]
 * @apiSuccess {Number} rate Rate parameter passed to function [b only]
 * @apiSuccess {String} date Date the function was invoked
 * @apiError InvalidGovernanceCode API was supplied a missing or invalid governance code which could not be processed
 */
router.get('/:hex?', function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('======================================================');
  console.log({ ip: ip, request: req.params });
  var result = calc.governance(req.params.hex);
  if (result === null) {
    res.statusCode = 400;
    res.statusMessage = 'InvalidGovernanceCode';
    res.send();
  } else {
    res.send(result);
  }
});

/**
 * @api {post} /v1/check Governance hexcode check
 * @apiName PostCheck
 * @apiGroup POST
 * @apiVersion 1.2.3
 *
 * @apiParam {String} governance Governance hexcode generated by the saferinsulin.org algorithm
 *
 * @apiSuccess {String} function Calculator function called: 'a' (start) or 'b' (continue).
 * @apiSuccess {Number} current Current glucose parameter passed to function
 * @apiSuccess {Number} last Previous glucose parameter passed to function [b only]
 * @apiSuccess {Number} rate Rate parameter passed to function [b only]
 * @apiSuccess {String} date Date the function was invoked
 * @apiError InvalidGovernanceCode API was supplied a missing or invalid governance code which could not be processed
 */
router.post('/', function (req, res) {
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  console.log('======================================================');
  console.log({ ip: ip, request: req.body });
  var result = calc.governance(req.body.governance);
  if (result === null) {
    res.statusCode = 400;
    res.statusMessage = 'InvalidGovernanceCode';
    res.send();
  } else {
    res.send(result);
  }
});

module.exports = router;

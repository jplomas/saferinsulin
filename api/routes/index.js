var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'saferinsulin.org API v1.00' });
});

module.exports = router;

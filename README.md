# Safer Insulin: Critical Care Insulin Calculator

[![npm version](https://badge.fury.io/js/insulin-calc.svg)](https://badge.fury.io/js/insulin-calc)
[![Build Status](https://travis-ci.org/jplomas/saferinsulin.svg?branch=master)](https://travis-ci.org/jplomas/saferinsulin)
[![Coverage](https://coveralls.io/repos/github/jplomas/saferinsulin/badge.svg?branch=master)](https://coveralls.io/github/jplomas/saferinsulin)
[![MIT license](https://img.shields.io/badge/license-MIT-green.svg)](https://github.com/jplomas/saferinsulin/blob/master/LICENSE)

This respository houses the website and underlying module code for an insulin infusion rate calculator currently being evaluated.

The website is live at [https://saferinsulin.org](https://saferinsulin.org)

It is provided to medical professionals for use at their own discretion: preparing the requirements for CE marking is underway and the tool has been used successfully in the Greater Manchester Critical Care Network.

## Technicals

### Building and deploying a mirror

This is positively encouraged, as it gives resiliance to the availability of the calculator.  To build:

- ensure yarn installed
- clone repository
- run ``yarn``
- run ``yarn run build``
- the website will be in the ``dist/`` folder, the app version ready to be packaged with Phonegap Build (or other Cordova-based toolset) will be in the ``app/`` folder
- if using Phonegap Build, ``yarn run zip`` will prepare the app for upload

### NPM module for calculator component

The module can be used within a node.js project by installing from npm: ```npm install insulin-calc``` or by including the browserified module ```dist/js/insulin-calc.js``` in a web project.

The following placeholder code should demonstrate how the functions are intended to be called and their parameters:

```js
/* Instantiate a calculator object */
var calc = require('insulin-calc')

/* Get a starting rate of insulin infusion */
var glucose = 17.2    // current glucose reading in mmol/L
var result = calc.startingRate(glucose)
console.log('New rate:', result.rate)
console.log('Advice:', result.advice)
console.log('Governance hex code:', result.hex)

/* Get a new rate of infusion when patient is already on insulin infusion */
var current = 12.1    // current glucose reading in mmol/L
var previous = 14.2   // previous glucose reading in mmol/L
var rate = 3          // current insulin infusion rate in ml/hr
var result = calc.ongoingRate(current, previous, rate)
console.log('New rate:', result.rate)
console.log('Advice:', result.advice)
console.log('Governance hex code:', result.hex)

/* Check a governance code */
var result = calc.governance('0d7-a82820')
console.log('Function ID used:', result.function)
console.log('Date generated:', result.date)
console.log('Parameter passed:', result.current)
```

The 'functions IDs' in the object returned by the governance code function are:

| Function | Version | name(params) |
| -------- | ------- | ------------ |
| a        | 1.x.x   | startingRate(currentGlucose) |
| b        | 1.x.x   | ongoingRate(currentGlucose, previousGlucose, currentRate) |

As future iterations of this project evolve, the intention is that previous versions of the algorithm are preserved to ensure governance codes can always be checked.

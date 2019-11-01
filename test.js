/* global describe, it */
const { expect } = require('chai');
const { assert } = require('chai');
const calc = require('./js/insulin-calc');

describe('Function when starting patient on Insulin', () => {
  it('When glucose is 30.0 should start at 4ml/hr', () => {
    const r = calc.startingRate(30);
    assert.equal(r.rate, 4);
  });
  it('When glucose greater than 30.0 should start at 4ml/hr', () => {
    const r = calc.startingRate(60);
    assert.equal(r.rate, 4);
  });
  it('When called with no parameter will report a rate of false', () => {
    const r = calc.startingRate();
    assert.equal(r.rate, false);
  });
  it('When called with a string that cannot be parsed into a float reports a rate of false', () => {
    const r = calc.startingRate('NULL');
    assert.equal(r.rate, false);
  });
  it('When called with a -ve value reports a rate of false', () => {
    const r = calc.startingRate(-10.2);
    assert.equal(r.rate, false);
  });
});

describe('Governance function', () => {
  it('When called with no parameter will report as null', () => {
    const r = calc.governance();
    assert.equal(r, null);
  });
  it('When called with an invalid code structure will report as null', () => {
    const r = calc.governance('A2-BBC43-AEFF');
    assert.equal(r, null);
  });
  it('When called with an invalid code structure will report as null', () => {
    const r = calc.governance(null);
    assert.equal(r, null);
  });
  it('When called with 9403b059-b81c6b will report correct output', () => {
    const r = calc.governance('9403b059-b81c6b');
    const d = r.date.substring(0,r.date.length - 6)
    assert.equal(r.function, 'b');
    assert.equal(r.current, 5.9);
    assert.equal(r.last, 8.9);
    assert.equal(r.rate, 14.8);
    assert.equal(d, 'Fri Nov 01 2019 13:21:00 GMT+0000');
  });
  it('When called with 0bc-a81c71 will report correct output', () => {
    const r = calc.governance('0bc-a81c71');
    const d = r.date.substring(0,r.date.length - 6)
    assert.equal(r.function, 'a');
    assert.equal(r.current, 18.8);
    assert.equal(r.last, null);
    assert.equal(r.rate, null);
    assert.equal(d, 'Fri Nov 01 2019 13:27:00 GMT+0000');
  });
});

describe('Function when adjusting an ongoing Insulin infusion', () => {
  it('When called with no parameter will report false', () => {
    const r = calc.ongoingRate();
    assert.equal(r, false);
  });
  it('When called with 1 missing parameter report false', () => {
    const r = calc.ongoingRate(10, 10);
    assert.equal(r, false);
  });
  it('When called with 2 missing parameters report false', () => {
    const r = calc.ongoingRate(10);
    assert.equal(r, false);
  });
});

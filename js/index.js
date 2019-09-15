/* eslint no-console: 0 */
/* global $ */

function hexDateConvert(fr) {
  var dt = new Date();
  var f = parseInt(fr, 16);
  f += 25678678;
  dt.setTime(f * 60000);
  return dt;
}

function getHexDate(n) {
  var m = Math.floor(n.getTime() / 60000);
  m -= 25678678;
  var x = m.toString(16);
  return x;
}

function glucoseToHex(i) {
  var x = parseFloat(i) * 10;
  var y = '00' + x.toString(16).substr(-16);
  y = y.slice(-3);
  return y;
}

function rateToHex(i) {
  var x = parseFloat(i) * 10;
  var y = '0' + x.toString(16).substr(-16);
  y = y.slice(-2);
  return y;
}

function hexToFloat(i) {
  return parseInt(i, 16) / 10;
}

function governance(hex) {
  var codes = hex.split('-');
  if (codes.length !== 2) { return null; }
  var f = codes[1].charAt(0);
  var d = hexDateConvert(codes[1].substr(1, codes[1].length));
  var rate = null;
  var curr = null;
  var last = null;
  if (f === 'a') {
    curr = hexToFloat(codes[0].substr(0, 3));
  }
  if (f === 'b' || f === 'c') {
    rate = hexToFloat(codes[0].substr(0, 2));
    curr = hexToFloat(codes[0].substr(2, 3));
    last = hexToFloat(codes[0].substr(5, 3));
  }
  return {
    function: f,
    current: curr,
    last: last,
    rate: rate,
    date: d.toString(),
  };
}

var dosubmit = function () { // eslint-disable-line
  var x = document.getElementById('d');
  var xx = x.value;
  var r = document.getElementById('r');
  r.innerHTML = hexDateConvert(xx);
};

var firstFunction = function (value) {
  var bg = parseFloat(value);
  var result = false;
  if (bg <= 4) { result = 'Treat hypoglycaemia according to protocol'; }
  if (bg > 4 && bg <= 10) { result = 'No insulin required - recheck 4-6 hourly'; }
  if (bg > 10 && bg <= 12) { result = 'Start insulin at 1 unit/hr'; }
  if (bg > 12 && bg <= 15) { result = 'Start insulin at 2 units/hr'; }
  if (bg > 15 && bg <= 18) { result = 'Start insulin at 3 units/hr'; }
  if (bg > 18) { result = 'Start insulin at 4 units/hr'; }
  return result;
}

var secondFunction = function (current, previous, rate) {
  if (!(Number.isNaN(current)) && !(Number.isNaN(previous)) && !(Number.isNaN(rate))) {
    // meat of the logic processing here
    // var diff = current - previous;
    var A11 = 'LOGIC ERROR';
    // below are v4 logic expressions - need reviewing...
    if (current <= 2.2) { A11 = '1'; }
    if (current >= 2.3 && current <= 4) { A11 = '2'; }
    if (current >= 4.1 && current < 6.1 && previous <= 6) { A11 = '3'; }
    if (current >= 4.1 && current < 6.1 && previous > 6 && (current - previous) < -1.5) { A11 = '2'; }
    if (current >= 4.1 && current < 6.1 && previous > 6 && (current - previous) >= -1.5 && (current - previous) < 0) { A11 = '3'; }
    if (current >= 6.1 && current < 8 && previous < 1.5) { A11 = '29'; }
    if (current >= 6.1 && current < 8 && previous > 1.5) { A11 = '53'; }
    if ((current >= 8 && current < 10.1) || (previous < 8 && previous > 10)) { A11 = '10'; }
    if (current >= 8 && current < 10.1 && previous >= 8 && previous <= 10) { A11 = '54'; }
    if (current >= 10.1 && current < 12.1 && previous <= 12 && (current - previous) < 0) { A11 = '17'; }
    if (current >= 10.1 && current < 12.1 && previous <= 12 && (current - previous) >= 0) { A11 = '36'; }
    if (current >= 10.1 && current < 12.1 && previous > 12 && (current - previous) < 0 && (current - previous) >= -2) { A11 = '32'; }
    if (current >= 10.1 && current < 12.1 && previous > 12 && (current - previous) < -2) { A11 = '33'; }
    if (current >= 12.1 && current <= 14 && previous < 12.1) { A11 = '34'; }
    if (current >= 12.1 && current <= 14 && previous >= 12.1 && previous <= 14 && (current - previous) >= 0) { A11 = '35'; }
    if (current >= 12.1 && current <= 14 && previous >= 12.2 && previous <= 14.4 && (current - previous) < 0 && (current - previous) >= -1) { A11 = '35'; }
    if (current >= 12.1 && current <= 14 && previous >= 13.2 && previous <= 18 && (current - previous) <= -0.5 && (current - previous) >= -3.9) { A11 = '37'; }
    if (current >= 12.1 && current <= 14 && previous >= 16.1 && previous <= 18 && (current - previous) <= -4) { A11 = '33'; }
    if (current >= 12.1 && current <= 14 && previous > 18) { A11 = '33'; }
    if (current > 14 && previous < 12.1) { A11 = '38'; }
    if (current > 14 && previous >= 12.1 && previous <= 14) { A11 = '34'; }
    if (current > 14 && previous > 14 && (current - previous) > 0) { A11 = '38'; }
    if (current > 14 && previous > 14 && (current - previous) <= 0 && (current - previous) >= -1.9) { A11 = '34'; }
    if (current > 14 && previous > 14 && (current - previous) < -1.9 && (current - previous) > -4) { A11 = '18'; }
    if (current > 14 && previous > 14 && (current - previous) <= -4) { A11 = '33'; }
    // ... to here ^^^^
    // ~~~~ verified below April 2019`
    var newR = -1;
    if (A11 === '1') { newR = 0; }
    if (A11 === '2') { newR = 0; }
    if (A11 === '3') { newR = 0; }
    if (A11 === '10') { newR = rate * (current / previous); }
    if (A11 === '17') { newR = rate; }
    if (A11 === '18') { newR = rate; }
    if (A11 === '29') { newR = 0; }
    if (A11 === '32') { newR = rate; }
    if (A11 === '33') { newR = rate * (current / previous); }
    if (A11 === '34') { newR = rate + 2; }
    if (A11 === '35') { newR = rate + 1; }
    if (A11 === '36') { newR = rate + 1; }
    if (A11 === '37') { newR = rate; }
    if (A11 === '38') { newR = rate + (2 * (current / previous)); }
    if (A11 === '53') { newR = rate * 0.5; }
    if (A11 === '54') { newR = rate; }
    // April 2019 ^^^
    // Also checked April 2019
    newR = Math.round(newR * 10) / 10;
    result = newR + 'ml/hr';
    if (A11 === '1') { result += '<br><br><strong>Additional advice:</strong><br>STOP INSULIN FOR AT LEAST 1 HOUR<br>Follow hypoglycaemia protocol.<br>Give IV dextrose immediately & ensure background nutrition or glucose intake.<br>Recheck blood glucose in 15, 30 and 60 minutes until stable.'; }
    if (A11 === '2') { result += '<br><br><strong>Additional advice:</strong><br>STOP INSULIN FOR AT LEAST 1 HOUR<br>Give IV dextrose immediately if blood glucose < 4mmol/L & ensure background nutrition or glucose intake.<br> If blood glucose is greater than 4mmol/l then it is falling rapidly. Recheck blood glucose in 30 and 60 minutes.'; }
    if (A11 === '3') { result += '<br><br><strong>Additional advice:</strong><br>STOP INSULIN FOR AT LEAST 1 HOUR<br>Ensure background nutrition or glucose intake. Recheck blood glucose in 1 hour.'; }
    if (A11 === '10') { result += '<br><br><strong>Additional advice:</strong><br>Recheck blood glucose in 1 hour.<br>If blood glucose has been between 6-10mmol consider 2 hourly blood glucose checks.'; }
    if (A11 === '17') { result += '<br><br><strong>Additional advice:</strong><br>Recheck blood glucose in 1 hour. '; }
    if (A11 === '18') { result += '<br><br><strong>Additional advice:</strong><br>Recheck blood glucose in 1-2 hours.<br>(1 hour if drop in blood glucose > 2 mmol/L in last hour)'; }
    if (A11 === '29') { result += '<br><br><strong>Additional advice:</strong><br>STOP INSULIN FOR AT LEAST 1 HOUR<br>Restart insulin if blood glucose > 10mmol/L'; }
    if (A11 === '32') { result += '<br><br><strong>Additional advice:</strong><br>Recheck blood glucose in 2 hours.'; }
    if (A11 === '33') { result += '<br><br><strong>Additional advice:</strong><br>Recheck blood glucose in 1 hour.'; }
    if (A11 === '34') { result += '<br><br><strong>Additional advice:</strong><br>Recheck blood glucose in 1 hour.'; }
    if (A11 === '35') { result += '<br><br><strong>Additional advice:</strong><br>Recheck blood glucose in 1 hour.'; }
    if (A11 === '36') { result += '<br><br><strong>Additional advice:</strong><br>Recheck blood glucose in 2 hours.'; }
    if (A11 === '37') { result += '<br><br><strong>Additional advice:</strong><br>Recheck blood glucose in 1 hour.'; }
    if (A11 === '38') { result += '<br><br><strong>Additional advice:</strong><br>Recheck blood glucose in 1 hour.'; }
    if (A11 === '53') { result += '<br><br><strong>Additional advice:</strong><br>Recheck blood glucose in 1 hour.<br>Caution as blood glucose is falling and approaching bottom of target range.'; }
    if (A11 === '54') { result += '<br><br><strong>Additional advice:</strong><br>If blood glucose and calorie intake have been stable for last 2 hours move to 2 hourly BG checks. '; }
    // ^^^ this bit checked April 2019 too
    // end of meat

    return result;
  }
  return false;
}

var calc = function () {
  var result = null;
  var current = parseFloat($('#d2').dropdown('get value'));
  var previous = parseFloat($('#d3').dropdown('get value'));
  var rate = parseFloat($('#d4').dropdown('get value'));
  console.log('rate = ' + rate);
  console.log('current = ' + current);
  console.log('previous = ' + previous);
  result = secondFunction(current, previous, rate)
  if (result) {
    var n = new Date();

    // [a] = pt not on insulin
    // [b] = pt on insulin
    // [c] = stopped & restarted
    // [3 hex] = reading x
    // [3 hex] = reading y
    // [2 hex] = rate
    // [X hex] = date

    var c = null;
    if ($('#b2').hasClass('teal')) {
      c = 'b';
    } else {
      c = 'c';
    }

    var hex = rateToHex(rate) + glucoseToHex(current) + glucoseToHex(previous) + '-' + c + getHexDate(n);

    result = result + '<br><br><strong>Calculation reference code (record in casenotes):</strong><br><span id="foo">' + hex + '</span>';
    result = result + '<br><span id="copyAdvice" data-clipboard-target="#foo">Copy code to clipboard</span>';
    return result;
  }
  return false;
};

$(document).ready(function () {
  $('.message .close')
  .on('click', function() {
    $(this)
      .closest('.message')
      .transition('fade')
    ;
  })
;
  var clipboard = new ClipboardJS('#copyAdvice');
  clipboard.on('success', function(e) {
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);
      $('.message').show();
      e.clearSelection();
  });

  clipboard.on('error', function(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
  });
  var oldBrowser = $.reject({
    reject: {
      safari: false, // Apple Safari
      chrome: false, // Google Chrome
      firefox: false, // Mozilla Firefox
      msie: true, // Microsoft Internet Explorer
      opera: false, // Opera
      konqueror: true, // Konqueror (Linux)
      unknown: true, // Everything else
    },
  }); // Customized Browsers
  if (oldBrowser) {
    window.location.href = 'old.html';
  }
  $('.dropdown').dropdown();
  $('.checkAgain').click(function () {
    $('#res').html('');
    $('#refCode').val('');
    $('#enterCode').show();
  });
  $('#checkButton').click(function () {
    $('.checkAgain').show();
    $('#enterCode').hide();
    var code = $('#refCode').val();
    var gov = governance(code);
    if (!gov) {
      $('#res').html('<p>Invalid code entered.<br /><br /></p>');
      return false
    }
    if (gov.last) {
      $('#res').html(`
                     <p>Code <strong>${code}</strong> was generated <strong>${gov.date}</strong></p>
                     <p>The user entered the following data:</p>
                     <div class="ui secondary segment">
                     <p>Current blood glucose [mmol/L]: <strong>${gov.current}</strong></p>
                     <p>Previous blood glucose [mmol/L]: <strong>${gov.last}</strong></p>
                     <p>Current Insulin rate [ml/hr of 1 iU/ml]: <strong>${gov.rate}</strong></p>
                     </div>
                     <p>For these values, the calculator generated the following output:</p>
                     <div class="ui secondary segment">
                     <p><strong>New Insulin rate:</strong><br />
                     ${secondFunction(gov.current.toString(),gov.last.toString(), gov.rate.toString())}</p>
                     </div><br>`);
    } else {
      if (gov.current) {
        $('#res').html(`
                       <p>Code <strong>${code}</strong> was generated <strong>${gov.date}</strong></p>
                       <p>The user entered the following data:</p>
                       <div class="ui secondary segment">
                       <p>Current blood glucose [mmol/L]: <strong>${gov.current}</strong></p>
                       </div>
                       <p>For these values, the calculator generated the following output:</p>
                       <div class="ui secondary segment">
                       <p><strong>New Insulin rate:</strong><br />
                       ${firstFunction(gov.current.toString())}</p>
                       </div><br>`);
      } else {
        $('#res').html('<p>Invalid code entered.<br /><br /></p>');
      }
    }
  });
  $('#b1').click(function () {
    $('#b1').removeClass('basic');
    $('#b1').addClass('teal');
    $('#c1').show();
    $('#c2').hide();
    $('#b2').removeClass('teal');
    $('#b2').addClass('basic');
    $('#b3').removeClass('teal');
    $('#b3').addClass('basic');
  });
  $('#b2').click(function () {
    $('#b2').removeClass('basic');
    $('#b2').addClass('teal');
    $('#c2').show();
    $('#c1').hide();
    $('#b1').removeClass('teal');
    $('#b1').addClass('basic');
    $('#b3').removeClass('teal');
    $('#b3').addClass('basic');
  });
  $('#b3').click(function () {
    $('#b3').removeClass('basic');
    $('#b3').addClass('teal');
    $('#c2').show();
    $('#c1').hide();
    $('#b1').removeClass('teal');
    $('#b1').addClass('basic');
    $('#b2').removeClass('teal');
    $('#b2').addClass('basic');
  });

  $('#d1').dropdown('setting', 'onChange', function () {
    $('.adviceA').html('Please select a blood glucose reading from the dropdown above then click the calculate button');
  });
  $('form').keyup(function () {
    $('.adviceA').html('Please select a blood glucose reading from the dropdown above then click the calculate button');
    $('.adviceB').html('Please select current and previous blood glucose readings and the current insulin rate from the dropdown above then click the calculate button');  
  });

  $('.doCalcA').click(function () {
    var value = parseFloat($('#d1').dropdown('get value'));
    console.log('BG = ' + value);
    var result = firstFunction(value);
    // add a governance token -- this will need storing in a DB somewhere...
    if (result) {
      var n = new Date();
      var hex = glucoseToHex(value) + '-a' + getHexDate(n);
      result = result + '<br><br><strong>Calculation reference code (record in casenotes):</strong><br><span id="foo">' + hex + '</span>';
      result = result + '<br><span id="copyAdvice" data-clipboard-target="#foo">Copy code to clipboard</span>';
    }
    $('.adviceA').html(result);
  });

  $('#d2').dropdown('setting', 'onChange', function () {
    // var c = calc();
    $('.adviceB').html('Please select current and previous blood glucose readings and the current insulin rate from the dropdown above then click the calculate button');
  });
  $('#d3').dropdown('setting', 'onChange', function () {
    // var c = calc();
    $('.adviceB').html('Please select current and previous blood glucose readings and the current insulin rate from the dropdown above then click the calculate button');
  });
  $('#d4').dropdown('setting', 'onChange', function () {
    // var c = calc();
    $('.adviceB').html('Please select current and previous blood glucose readings and the current insulin rate from the dropdown above then click the calculate button');
  });
  $('.doCalc').click(function () {
    var c = calc();
    $('.adviceB').html(c);
  });
  $('.resetC').click(function () {
    $('#frm1').trigger('reset');
    $('#frm2').trigger('reset');
    $('.ui.form .ui.dropdown').dropdown('restore defaults');
  });
});

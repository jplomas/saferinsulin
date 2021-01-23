/* eslint no-console: 0, max-len: 0, prefer-destructuring: 0 */
/* global $, ClipboardJS, calc, FastClick */

var parseResult = function (advice) {
  var output = '';
  if (advice.type === 'additional') {
    output += '<br><br><strong>Additional advice:</strong><br>';
  }
  advice.text.forEach(function (element) {
    output += element + '<br>';
  });
  return output;
};

var gocalc = function () {
  var result = null;
  var current = parseFloat($('#d2').dropdown('get value'));
  var previous = parseFloat($('#d3').dropdown('get value'));
  var rate = parseFloat($('#d4').dropdown('get value'));
  console.log('rate = ' + rate);
  console.log('current = ' + current);
  console.log('previous = ' + previous);
  result = calc.ongoingRate(current, previous, rate).rate + parseResult(calc.ongoingRate(current, previous, rate).advice);
  if (result) {
    var hex = calc.ongoingRate(current, previous, rate).hex;
    result = result
      + '<br><br><strong>Calculation reference code (record in casenotes):</strong><br><span id="foo">'
      + hex
      + '</span>';
    result += '<br><span id="copyAdvice" data-clipboard-target="#foo"><button class="ui mini button"><i class="ui copy icon"></i> Copy code to clipboard</button></span>';
    return result;
  }
  return false;
};

$(function () {
  FastClick.attach(document.body);
});

$(document).ready(function () {
  $('.message .close').on('click', function () {
    $(this).closest('.message').transition('fade');
  });
  var clipboard = new ClipboardJS('#copyAdvice');
  clipboard.on('success', function (e) {
    console.info('Action:', e.action);
    console.info('Text:', e.text);
    console.info('Trigger:', e.trigger);
    $('.message').show();
    e.clearSelection();
  });

  clipboard.on('error', function (e) {
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
      unknown: false, // Everything else
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
    var gov = calc.governance(code);
    if (!gov) {
      $('#res').html('<p>Invalid code entered.<br /><br /></p>');
      return false;
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
        ${calc.ongoingRate(gov.current, gov.last, gov.rate).rate + parseResult(calc.ongoingRate(gov.current, gov.last, gov.rate).advice)}
        </p>
        </div><br>`);
      return true;
    }
    if (gov.current) {
      $('#res').html(`
        <p>Code <strong>${code}</strong> was generated <strong>${gov.date}</strong></p>
        <p>The user entered the following data:</p>
        <div class="ui secondary segment">
        <p>Current blood glucose [mmol/L]: <strong>${gov.current}</strong></p>
        </div>
        <p>For these values, the calculator generated the following output:</p>
        <div class="ui secondary segment">
        <p><strong>Advice:</strong><br />
        ${parseResult(calc.startingRate(gov.current).advice)}</p>
        </div><br>`);
      return true;
    }
    $('#res').html('<p>Invalid code entered.<br /><br /></p>');
    return false;
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
    $('.message').hide();
    $('#frm1').trigger('reset');
    $('#frm2').trigger('reset');
    $('.ui.form .ui.dropdown').dropdown('restore defaults');
    $('#CB1').checkbox();
    $('#CB1').checkbox('uncheck');
    $('#cpsuccess').hide();
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
    $('.message').hide();
    $('#frm1').trigger('reset');
    $('#frm2').trigger('reset');
    $('.ui.form .ui.dropdown').dropdown('restore defaults');
    $('#CB2').checkbox();
    $('#CB2').checkbox('uncheck');
    $('#cpsuccess').hide();
  });

  $('#d1').dropdown('setting', 'onChange', function () {
    if ($('#CB1').checkbox('is checked') === true) {
      $('.adviceA').html('Please select a blood glucose reading from the dropdown above then click the calculate button');
      $('#cpsuccess').hide();
    }
  });
  $('form').keyup(function () {
    $('.adviceA').html('Please select a blood glucose reading from the dropdown above then click the calculate button');
    $('.adviceB').html('Please select current and previous blood glucose readings and the current insulin rate from the dropdown above then click the calculate button');
    $('#cpsuccess').hide();
  });

  $('.doCalcA').click(function () {
    var value = parseFloat($('#d1').dropdown('get value'));
    console.log('BG = ' + value);
    if (value) {
      var r = calc.startingRate(value);
      var result = parseResult(r.advice);
      var hex = r.hex;
      result = result + '<br><br><strong>Calculation reference code (record in casenotes):</strong><br><span id="foo">' + hex + '</span>';
      result += '<br><span id="copyAdvice" data-clipboard-target="#foo"><button class="ui mini button"><i class="ui copy icon"></i> Copy code to clipboard</button></span>';
      $('.adviceA').html(result);
    }
  });

  $('#d2').dropdown('setting', 'onChange', function () {
    if ($('#CB2').checkbox('is checked') === true) {
      $('.adviceB').html('Please select current and previous blood glucose readings and the current insulin rate from the dropdown above then click the calculate button');
      $('#cpsuccess').hide();
    }
  });
  $('#d3').dropdown('setting', 'onChange', function () {
    if ($('#CB2').checkbox('is checked') === true) {
      $('.adviceB').html('Please select current and previous blood glucose readings and the current insulin rate from the dropdown above then click the calculate button');
      $('#cpsuccess').hide();
    }
  });
  $('#d4').dropdown('setting', 'onChange', function () {
    if ($('#CB2').checkbox('is checked') === true) {
      $('.adviceB').html('Please select current and previous blood glucose readings and the current insulin rate from the dropdown above then click the calculate button');
      $('#cpsuccess').hide();
    }
  });
  $('.doCalc').click(function () {
    var c = gocalc();
    if (c) {
      $('.adviceB').html(c);
    }
  });
  $('.resetC').click(function () {
    $('#frm1').trigger('reset');
    $('#frm2').trigger('reset');
    $('.ui.form .ui.dropdown').dropdown('restore defaults');
    $('#cpsuccess').hide();
  });
  $('#CB1').click(function () {
    console.log('Checkbox status: ', $('#CB1').checkbox('is checked'));
    $('#cpsuccess').hide();
    if ($('#CB1').checkbox('is checked') === true) {
      $('.doCalcA').hide();
      $('.rA').hide();
      $('#frm1').trigger('reset');
      $('#frm2').trigger('reset');
      $('.ui.form .ui.dropdown').dropdown('restore defaults');
      $('.adviceA').html('Intravenous insulin infusions require background nutrition to avoid hypoglycaemia. If enteral feed is interrupted arrange immediate glucose containing IV maintenance fluid. If no background feed or glucose containing fluid is available stop IV insulin and request urgent clinical review from the medical team.<br><br>If background nutrition is available, change the slider above to \'Yes\' to activate the calculator.');
    } else {
      $('.doCalcA').show();
      $('.rA').show();
      $('.adviceA').html('Please select a blood glucose reading from the dropdown above then click the calculate button');
    }
  });
  $('#CB2').click(function () {
    console.log('Checkbox status: ', $('#CB2').checkbox('is checked'));
    $('#cpsuccess').hide();
    if ($('#CB2').checkbox('is checked') === true) {
      $('.doCalc').hide();
      $('.rB').hide();
      $('#frm1').trigger('reset');
      $('#frm2').trigger('reset');
      $('.ui.form .ui.dropdown').dropdown('restore defaults');
      $('.adviceB').html('Intravenous insulin infusions require background nutrition to avoid hypoglycaemia. If enteral feed is interrupted arrange immediate glucose containing IV maintenance fluid. If no background feed or glucose containing fluid is available stop IV insulin and request urgent clinical review from the medical team.<br><br>If background nutrition is available, change the slider above to \'Yes\' to activate the calculator.');
    } else {
      $('.doCalc').show();
      $('.rB').show();
      $('.adviceB').html('Please select a blood glucose reading from the dropdown above then click the calculate button');
    }
  });
  $('#CB1').checkbox();
  $('#CB1').checkbox('uncheck');
  $('#CB2').checkbox();
  $('#CB2').checkbox('uncheck');
});

/* eslint no-console: 0 */
/* global $, ClipboardJS, calc */

var gocalc = function () {
  var result = null;
  var current = parseFloat($('#d2').dropdown('get value'));
  var previous = parseFloat($('#d3').dropdown('get value'));
  var rate = parseFloat($('#d4').dropdown('get value'));
  console.log('rate = ' + rate);
  console.log('current = ' + current);
  console.log('previous = ' + previous);
  result = calc.ongoingRate(current, previous, rate).rate + calc.ongoingRate(current, previous, rate).advice;
  if (result) {
    var hex = calc.ongoingRate(current, previous, rate).hex;
    result = result + '<br><br><strong>Calculation reference code (record in casenotes):</strong><br><span id="foo">' + hex + '</span>';
    result += '<br><span id="copyAdvice" data-clipboard-target="#foo"><button class="ui mini button"><i class="ui copy icon"></i> Copy code to clipboard</button></span>';
    return result;
  }
  return false;
};

$(document).ready(function () {
  $('.message .close')
    .on('click', function () {
      $(this)
        .closest('.message')
        .transition('fade');
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
                     ${calc.ongoingRate(gov.current, gov.last, gov.rate).rate + calc.ongoingRate(gov.current, gov.last, gov.rate).advice}</p>
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
                     ${calc.startingRate(gov.current).advice}</p>
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
    if (value) {
      var r = calc.startingRate(value);
      var result = r.advice;
      var hex = r.hex;
      result = result + '<br><br><strong>Calculation reference code (record in casenotes):</strong><br><span id="foo">' + hex + '</span>';
      result += '<br><span id="copyAdvice" data-clipboard-target="#foo"><button class="ui mini button"><i class="ui copy icon"></i> Copy code to clipboard</button></span>';
      $('.adviceA').html(result);
    }
  });

  $('#d2').dropdown('setting', 'onChange', function () {
    $('.adviceB').html('Please select current and previous blood glucose readings and the current insulin rate from the dropdown above then click the calculate button');
  });
  $('#d3').dropdown('setting', 'onChange', function () {
    $('.adviceB').html('Please select current and previous blood glucose readings and the current insulin rate from the dropdown above then click the calculate button');
  });
  $('#d4').dropdown('setting', 'onChange', function () {
    $('.adviceB').html('Please select current and previous blood glucose readings and the current insulin rate from the dropdown above then click the calculate button');
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
  });
});

/*****
 * CONFIGURATION
 */
//Main navigation
$.navigation = $('nav > ul.nav');

$.panelIconOpened = 'icon-arrow-up';
$.panelIconClosed = 'icon-arrow-down';

//Default colours
$.brandPrimary = '#20a8d8';
$.brandSuccess = '#4dbd74';
$.brandInfo = '#63c2de';
$.brandWarning = '#f8cb00';
$.brandDanger = '#f86c6b';

$.grayDark = '#2a2c36';
$.gray = '#55595c';
$.grayLight = '#818a91';
$.grayLighter = '#d1d4d7';
$.grayLightest = '#f8f9fa';

'use strict';

/****
 * MAIN NAVIGATION
 */

$(document).ready(function ($) {

  // Add class .active to current link
  $.navigation.find('a').each(function () {

    var cUrl = String(window.location).split('?')[0];

    if (cUrl.substr(cUrl.length - 1) == '#') {
      cUrl = cUrl.slice(0, -1);
    }

    if ($($(this))[0].href == cUrl) {
      $(this).addClass('active');

      $(this).parents('ul').add(this).each(function () {
        $(this).parent().addClass('open');
      });
    }
  });

  // Dropdown Menu
  $.navigation.on('click', 'a', function (e) {

    if ($.ajaxLoad) {
      e.preventDefault();
    }

    if ($(this).hasClass('nav-dropdown-toggle')) {
      $(this).parent().toggleClass('open');
      resizeBroadcast();
    }

  });

  function resizeBroadcast() {

    var timesRun = 0;
    var interval = setInterval(function () {
      timesRun += 1;
      if (timesRun === 5) {
        clearInterval(interval);
      }
      window.dispatchEvent(new Event('resize'));
    }, 62.5);
  }

  /* ---------- Main Menu Open/Close, Min/Full ---------- */
  $('.navbar-toggler').click(function () {

    if ($(this).hasClass('sidebar-toggler')) {
      $('body').toggleClass('sidebar-hidden');
      resizeBroadcast();
    }

    if ($(this).hasClass('sidebar-minimizer')) {
      $('body').toggleClass('sidebar-minimized');
      resizeBroadcast();
    }

    if ($(this).hasClass('aside-menu-toggler')) {
      $('body').toggleClass('aside-menu-hidden');
      resizeBroadcast();
    }

    if ($(this).hasClass('mobile-sidebar-toggler')) {
      $('body').toggleClass('sidebar-mobile-show');
      resizeBroadcast();
    }

  });

  $('.sidebar-close').click(function () {
    $('body').toggleClass('sidebar-opened').parent().toggleClass('sidebar-opened');
  });

  /* ---------- Disable moving to top ---------- */
  $('a[href="#"][data-top!=true]').click(function (e) {
    e.preventDefault();
  });

});

/****
 * CARDS ACTIONS
 */

$(document).on('click', '.card-actions a', function (e) {
  e.preventDefault();

  if ($(this).hasClass('btn-close')) {
    $(this).parent().parent().parent().fadeOut();
  } else if ($(this).hasClass('btn-minimize')) {
    var $target = $(this).parent().parent().next('.card-block');
    if (!$(this).hasClass('collapsed')) {
      $('i', $(this)).removeClass($.panelIconOpened).addClass($.panelIconClosed);
    } else {
      $('i', $(this)).removeClass($.panelIconClosed).addClass($.panelIconOpened);
    }

  } else if ($(this).hasClass('btn-setting')) {
    $('#myModal').modal('show');
  }

});

function capitalizeFirstvarter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function init(url) {

  /* ---------- Tooltip ---------- */
  $('[rel="tooltip"],[data-rel="tooltip"]').tooltip({"placement": "bottom", delay: {show: 400, hide: 200}});

  /* ---------- Popover ---------- */
  $('[rel="popover"],[data-rel="popover"],[data-toggle="popover"]').popover();

}


function reload() {
  location.reload();
}

function buildFitnessChart(data) {
  var myChart = echarts.init(document.getElementById('fitness-chart'));

  var option = {
    title: {
      text: 'Steps'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0];
        return params.value[0] + ' : ' + params.value[1];
      },
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      name: 'steps',
      type: 'line',
      data: data
    }]
  };

  console.log(option);

  myChart.setOption(option);
}


function buildSleepChart(data) {
  var myChart = echarts.init(document.getElementById('sleep-chart'));

  var option = {
    title: {
      text: 'Sleep minutes'
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        params = params[0];
        return params.value[0] + ' : ' + params.value[1];
      },
      axisPointer: {
        animation: false
      }
    },
    xAxis: {
      type: 'time',
      splitLine: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
    },
    series: [{
      name: 'total_sleep_minutes',
      type: 'line',
      data: data
    }]
  };

  console.log(option);

  myChart.setOption(option);
}

if (USER_ID && USER_ID != 'undefined') {
  io.socket.get('/resource/subscribe', function (data) {
    console.log('Socket Join!!!', data);
  });

  io.socket.on('user', function onServerSentEvent(msg) {
    console.log('Socket Data Received!!!', msg);
    reload();
  });

  io.socket.on('activity_day_summary', function onServerSentEvent(msg) {
    console.log('Socket Data Received!!!', msg);
    reload()
  });

  io.socket.on('sleep_summary', function onServerSentEvent(msg) {
    console.log('Socket Data Received!!!', msg);
    reload()
  });

  var fitnesses = FITNESS.map((item) => {
    return {name: Date.parse(item.date).toString(), value: [item.date, item.total_steps]}
  });
  var sleeps = SLEEP.map((item) => {
    return {name: Date.parse(item.date).toString(), value: [item.date, item.total_sleep_minutes]}
  });

  buildFitnessChart(fitnesses);
  buildSleepChart(sleeps);

}


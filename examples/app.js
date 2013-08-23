var ClockInput = require('../');

var clock = ClockInput(document.querySelector('#clock'));

// by default the clock is not set to anything
clock.set_time(new Date());

// clock widget is changed
clock.on('change', function(date) {
    console.log(date);
});


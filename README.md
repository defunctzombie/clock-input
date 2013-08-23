# clock-input

clock-like time input control

## install

```shell
npm install clock-input
```

## use

```js
var ClockInput = require('clock-input');

var clock = ClockInput(document.querySelector('#clock'));

// set the hour/minute off the passed in date
clock.set_time(new Date());

clock.on('change', function(date) {
    date.getHours();
    date.getMinutes();
});
```

Package via [browserify](https://github.com/substack/node-browserify) or your other favorite bundler.

## api

### ClockInput(HTMLElement)

return a new clock-input object created inside of the element you provide

### ClockInput.set_time(date)

Set the input time to the date's time

## events

The following events are emitted as ClockInput is an [Emitter](https://github.com/component/emitter)

### change(date)

Change gets a date parameter with the newly selected time. Is also emitted when you explicitly set the time via set_time.

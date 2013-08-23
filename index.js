var domify = require('domify');
var Emitter = require('emitter');
var inherits = require('inherits');
var classes = require('classes');

const k_hour_size = Math.PI / 6;

var tmpl =
'<div class="clock-input">' +
    '<div class="hour-clock">' +
        '<div class="hour-labels">' +
            '<div class="minute-clock">' +
                '<div class="minute-labels"></div>' +
            '</div>' +
        '</div>' +
    '</div>' +
    '<div data-ampm="am" class="ampm-select am">am</div>' +
    '<div data-ampm="pm" class="ampm-select pm">pm</div>'
'</div>';

var ClockInput = function(element) {
    if (!(this instanceof ClockInput)) {
        return new ClockInput(element);
    }

    var self = this;
    var el = element.appendChild(domify(tmpl));

    // hour elements
    var hours = self.hours = {};

    // 5 minute elements
    var minutes = self.minutes = {};

    self.selected_hour;
    self.selected_minute;

    self.selected_time = new Date(0, 0, 0, 0, 0);
    self.am = el.querySelector('.ampm-select.am');
    self.pm = el.querySelector('.ampm-select.pm');
    self.ampm_offset = 0;

    function mk_circle(element, label_fn) {
        var hour = 0 + Math.PI / 2;

        for (var i=0 ; i<12 ; ++i) {
            var x = Math.cos(hour);
            var y = Math.sin(hour);

            var label = document.createElement('div');
            label.className = 'time-label';
            label.style.left = (50 * x + 50) + '%';
            label.style.top = (-50 * y + 50) + '%';

            label_fn(label, i);

            hour -= k_hour_size;
            element.appendChild(label);
        }
    }

    var hour_circle = el.querySelector('.hour-labels');

    mk_circle(hour_circle, function(label, idx) {
        label.className += ' hour-label';
        label.setAttribute('data-hour', idx);
        label.innerHTML = idx || 12;
        hours[idx] = label;
    });

    var minute_circle = document.querySelector('.minute-labels');

    mk_circle(minute_circle, function(label, idx) {
        label.className += ' minute-label';
        label.setAttribute('data-minute', idx * 5);
        label.innerHTML = idx * 5;
        minutes[idx * 5] = label;
    });

    el.addEventListener('click', function(ev) {
        var hour = ev.target.getAttribute('data-hour');
        if (hour) {
            self.selected_time.setHours(hour - 0 + self.ampm_offset);
            return self.set_time(self.selected_time);
        }

        var minute = ev.target.getAttribute('data-minute');
        if (minute) {
            self.selected_time.setMinutes(minute);
            return self.set_time(self.selected_time);
        }

        var ampm = ev.target.getAttribute('data-ampm');
        if (ampm && ampm === 'am') {
            if (self.selected_time.getHours() >= 12) {
                self.selected_time.setHours(self.selected_time.getHours() - 12);
                self.set_time(self.selected_time);
            }
            self.ampm_offset = 0;
            classes(self.am).add('selected');
            classes(self.pm).remove('selected');
        }
        else if (ampm && ampm === 'pm') {
            if (self.selected_time.getHours() < 12) {
                self.selected_time.setHours(self.selected_time.getHours() + 12);
                self.set_time(self.selected_time);
            }
            self.ampm_offset = 12;
            classes(self.pm).add('selected');
            classes(self.am).remove('selected');
        }
    });
};

inherits(ClockInput, Emitter);

var proto = ClockInput.prototype;

// set clock time
// minutes are truncated to previous 5 minute block
proto.set_time = function(date) {
    var self = this;

    var hr = date.getHours();
    var min = date.getMinutes();

    self.selected_time.setHours(hr);
    self.selected_time.setMinutes(min);

    if (hr >= 12) {
        self.ampm_offset = 12;
        classes(self.am).remove('selected');
        classes(self.pm).add('selected');
    }
    else {
        classes(self.am).add('selected');
        classes(self.pm).remove('selected');
    }

    if (self.selected_hour) {
        classes(self.selected_hour).remove('selected');
    }

    if (self.selected_minute) {
        classes(self.selected_minute).remove('selected');
    }

    self.selected_hour = self.hours[hr % 12];
    self.selected_minute = self.minutes[min - min % 5];

    classes(self.selected_hour).add('selected');
    classes(self.selected_minute).add('selected');

    self.emit('change', self.selected_time);
};

module.exports = ClockInput;
